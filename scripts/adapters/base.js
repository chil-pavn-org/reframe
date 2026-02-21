/**
 * Base adapter interface for LLM providers.
 * All adapters must extend this class and implement generate().
 */
export class LLMAdapter {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Send a prompt to the LLM and return the raw text response.
   * @param {string} prompt - The full prompt to send
   * @returns {Promise<string>} The LLM's text response
   */
  async generate(prompt) {
    throw new Error('generate() must be implemented by the adapter');
  }

  /**
   * Get the name of this adapter (for logging).
   */
  get name() {
    return 'base';
  }
}
