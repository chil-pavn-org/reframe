import { LLMAdapter } from './base.js';

export class ClaudeAdapter extends LLMAdapter {
  get name() { return 'claude'; }

  async generate(prompt) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is not set');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.options.model || 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: 'You are a creative writer and content strategist. Always respond with valid JSON only, no markdown fences.',
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.content[0].text;
  }
}
