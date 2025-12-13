import { askLLM } from '../../ai/openrouter.client.js';
import { parseLLMResponse } from '../../ai/response.parser.js';
import { routeIntent } from '../logic/intent.router.js';

export async function onMessage(ctx) {
  try {
    const userId = ctx.from.id;
    const text = ctx.message.text;

    console.log(`📩 Сообщение от ${userId}: ${text}`);

    // text to openrouter
    const llmRaw = await askLLM([{ role: 'user', content: text }]);

    // JSON parse
    const llm = parseLLMResponse(llmRaw);

    console.log('💡 Ответ LLM:', llm);

    // send to intent.router
    await routeIntent(ctx, llm);

  } catch (err) {
    console.error('❌ Ошибка в обработчике сообщений:', err);
    await ctx.reply('Произошла ошибка, попробуйте ещё раз.');
  }
}
