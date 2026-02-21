import { LLMAdapter } from './base.js';

export class OpenAIAdapter extends LLMAdapter {
  get name() { return 'openai'; }

  async generate(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is not set');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.options.model || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a creative writer and content strategist. Always respond with valid JSON only, no markdown fences.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
}
