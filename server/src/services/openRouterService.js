const axios = require('axios');
const config = require('../config/env');

class OpenRouterService {
  static isConfigured() {
    return Boolean(config.OPENROUTER_API_KEY);
  }

  static async generateChat({ prompt, systemPrompt }) {
    if (!this.isConfigured()) return null;

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt || 'You are an expert Food Packaging AI Scientist.' },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      return response.data?.choices?.[0]?.message?.content || null;
    } catch (err) {
      console.warn('[OpenRouterService] Error:', err.message);
      return null;
    }
  }
}

module.exports = OpenRouterService;
