import { config } from '../config/config.js';
import { generateSystemPrompt } from './systemPrompt.js';
import * as YcApi from '../yclients/bookings.api.js';

class OpenRouterClient {
  constructor() {
    this.apiKey = config.openrouter.apiKey;
    this.baseURL = config.openrouter.baseURL;
    this.model = config.openrouter.model;
    this.conversationHistory = new Map();
  }

  getHistory(chatId) {
    if (!this.conversationHistory.has(chatId)) this.conversationHistory.set(chatId, []);
    return this.conversationHistory.get(chatId);
  }

  addToHistory(chatId, role, content) {
    const history = this.getHistory(chatId);
    history.push({ role, content });
    if (history.length > 50) this.conversationHistory.set(chatId, history.slice(-50));
  }

  clearHistory(chatId) {
    this.conversationHistory.set(chatId, []);
  }

  async sendMessage(chatId, userMessage) {
    try {
      // Берём актуальные данные с Yclients
      const staff = (await YcApi.getStaff()).data;
      const services = (await YcApi.getServices()).data;

      const systemPrompt = generateSystemPrompt(staff, services);
      this.addToHistory(chatId, 'user', userMessage);
      const history = this.getHistory(chatId);

      const payload = {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.2
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content?.trim() || '';
      const parsed = this.safeJSON(raw);

      this.addToHistory(chatId, 'assistant', raw);

      return parsed;

    } catch (err) {
      console.error('❌ OpenRouter error:', err);
      return { type: 'message', msg: 'Ошибка обработки. Попробуйте снова.' };
    }
  }

  safeJSON(str) {
    try { return JSON.parse(str); }
    catch { return { type: 'message', msg: 'Не удалось разобрать ответ AI.' }; }
  }
}

export default new OpenRouterClient();
