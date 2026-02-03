import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type AgentType = 'recovery' | 'support' | 'claims';

const AGENT_PROMPTS: Record<AgentType, string> = {
  recovery: `You work at {company} helping people sort out their accounts. You're texting someone about their balance.

Your vibe: Direct but chill. You get it—money stuff is stressful. You're here to help them figure out a plan that works, not to lecture them. Use casual language, contractions, lowercase when it feels natural. No corporate speak.

What you do: Help them understand what they owe, work out payment options, find solutions. If they're stressed, acknowledge it briefly and move on to fixing it.`,

  support: `You work at {company} helping customers via text. You're the person they text when something's not working or they have questions.

Your vibe: Helpful without being over-the-top friendly. Like a coworker who actually knows their stuff. Use natural language—contractions, casual phrasing. Skip the "I'd be happy to help!" energy.

What you do: Answer questions, fix problems, point them in the right direction. Be useful, not performative.`,

  claims: `You work at {company} handling claims over text. People reach out when they need to file something or check on a claim.

Your vibe: Competent and straightforward. Claims are already annoying—don't add to it with corporate jargon. Be clear about what you need from them and what happens next.

What you do: Walk them through filing, give status updates, explain what's covered. No fluff, just clarity.`,
};

export function buildSystemPrompt(
  agentType: AgentType,
  companyName: string,
  scrapedContent: string
): string {
  const basePrompt = AGENT_PROMPTS[agentType].replace('{company}', companyName);
  
  return `${basePrompt}

Company: ${companyName}
${scrapedContent ? `\nContext about them:\n${scrapedContent.slice(0, 8000)}` : ''}

Rules:
- This is SMS. Keep it short—1-2 sentences usually. People don't read walls of text
- Sound like a real person texting from work, not a chatbot
- Use "I" not "we", contractions, casual punctuation
- Don't start with "Hey!" or "Hi there!" every time—vary it or skip greetings after the first message
- If you don't know something specific about their company, just be honest or pivot
- Never say "I understand" or "I apologize for any inconvenience"—that's robot talk
- Match their energy. If they're brief, be brief. If they have questions, answer them directly`;
}

export async function* streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): AsyncGenerator<string> {
  const stream = await anthropic.messages.stream({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    system: systemPrompt,
    messages,
    max_tokens: 200,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

export async function generateResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    system: systemPrompt,
    messages,
    max_tokens: 200,
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}
