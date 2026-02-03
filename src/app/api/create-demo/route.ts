import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scrapeWebsite } from '@/lib/scraper';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { website, email, agentType } = await req.json();

    if (!website || !email || !agentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['recovery', 'support', 'claims'].includes(agentType)) {
      return NextResponse.json(
        { error: 'Invalid agent type' },
        { status: 400 }
      );
    }

    let companyName = 'Your Company';
    let scrapedContent = '';

    try {
      const scrapeResult = await scrapeWebsite(website);
      companyName = scrapeResult.companyName;
      scrapedContent = scrapeResult.content;
    } catch (scrapeError) {
      console.error('Scraping failed:', scrapeError);
    }

    const { data: session, error } = await supabase
      .from('demo_sessions')
      .insert({
        email,
        company_url: website,
        company_name: companyName,
        agent_type: agentType,
        scraped_content: scrapedContent,
        message_count: 0,
        booking_shown: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create demo session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      companyName,
      agentType,
    });
  } catch (error) {
    console.error('Create demo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
