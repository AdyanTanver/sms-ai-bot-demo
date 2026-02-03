import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildSystemPrompt, generateResponse, AgentType } from '@/lib/llm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from('demo_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    await supabase.from('demo_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message,
    });

    const { data: previousMessages } = await supabase
      .from('demo_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    const messages = (previousMessages || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const systemPrompt = buildSystemPrompt(
      session.agent_type as AgentType,
      session.company_name || 'Your Company',
      session.scraped_content || ''
    );

    const response = await generateResponse(messages, systemPrompt);

    await supabase.from('demo_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: response,
    });

    const newMessageCount = session.message_count + 1;
    await supabase
      .from('demo_sessions')
      .update({ message_count: newMessageCount })
      .eq('id', sessionId);

    return NextResponse.json({
      response,
      messageCount: newMessageCount,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
