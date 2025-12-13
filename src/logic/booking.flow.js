import { updateUserState, getUserState } from './conversation.manager.js';

export async function handleBooking(ctx, llmResponse) {
  try {
    const userId = ctx.from.id;
    const missing = llmResponse.missing_fields || [];
    const bookingData = llmResponse.data || {};

    // missing fields
    if (missing.length > 0) {
      await ctx.reply(
        `Пожалуйста, уточните следующие данные: ${missing.join(', ')}`
      );

      // store data to state
      const prevState = getUserState(userId);
      updateUserState(userId, { ...prevState, bookingData });

      return;
    }

    // show data to user
    await ctx.reply(
      `✅ Все данные получены! Можете проверить:\n${JSON.stringify(
        bookingData,
        null,
        2
      )}\nСейчас готово к записи в Yclients.`
    );

    // Yclients API soon

    // store state
    updateUserState(userId, { bookingData });

  } catch (err) {
    console.error('❌ Ошибка в booking.flow:', err);
    await ctx.reply('Произошла ошибка при обработке записи.');
  }
}
