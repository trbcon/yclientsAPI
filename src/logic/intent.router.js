import { handleBooking } from './booking.flow.js';

export async function routeIntent(ctx, llmResponse) {
  try {
    switch (llmResponse.intent) {
      case 'create_booking':
        // to booking
        await handleBooking(ctx, llmResponse);
        break;

      case 'small_talk':
        // reply
        await ctx.reply(llmResponse.data?.message || 'Я тебя понял 😎');
        break;

      default:
        await ctx.reply('🤔 Я пока не знаю, как это обработать.');
        console.log('Неизвестный intent:', llmResponse.intent);
    }
  } catch (err) {
    console.error('❌ Ошибка в intent.router:', err);
    await ctx.reply('Произошла ошибка при обработке вашего запроса.');
  }
}
