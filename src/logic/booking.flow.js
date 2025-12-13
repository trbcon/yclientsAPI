import * as YcApi from '../yclients/bookings.api.js';

export async function handleBooking(ctx, data) {
  const required = ['fullname', 'phone', 'staff_id', 'service_ids', 'time'];
  const missing = required.filter(f => !data[f] || (Array.isArray(data[f]) && data[f].length === 0));

  if (missing.length > 0) {
    return ctx.reply(`❌ Не хватает данных: ${missing.join(', ')}. Пожалуйста, уточните.`);
  }

  try {
    const result = await YcApi.createBooking({
      fullname: data.fullname,
      phone: data.phone,
      staff_id: data.staff_id,
      service_ids: data.service_ids,
      time: data.time,
      email: data.email || null,
      comment: data.comment || ''
    });

    await ctx.reply(`✅ Запись успешно создана! ID: ${result.id || 'неизвестно'}`);
  } catch (err) {
    console.error('❌ Booking error:', err);
    await ctx.reply('❌ Не удалось создать запись. Попробуйте снова.');
  }
}
