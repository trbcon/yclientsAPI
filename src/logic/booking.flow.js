import { updateUserState, getUserState, clearUserState } from './conversation.manager.js';
import { createBooking } from '../yclients/bookings.api.js';

export async function handleBooking(ctx, llmResponse) {
  try {
    const userId = ctx.from.id;
    const missing = llmResponse.missing_fields || [];
    const bookingData = llmResponse.data || {};

    if (missing.length > 0) {
      await ctx.reply(
        `Пожалуйста, уточните следующие данные: ${missing.join(', ')}`
      );

      // store to state
      const prevState = getUserState(userId);
      updateUserState(userId, { ...prevState, bookingData });

      return;
    }

    // booking
    const result = await createBooking(bookingData);

    console.log('✅ Booking result:', result);

    await ctx.reply('✅ Запись успешно создана!');

    // clear state
    clearUserState(userId);

  } catch (err) {
    console.error('❌ Ошибка в booking.flow:', err);
    await ctx.reply('❌ Не удалось создать запись. Попробуйте позже.');
  }
}
