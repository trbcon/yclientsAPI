import { handleBooking } from './booking.flow.js';
import * as YcApi from '../yclients/bookings.api.js';

export async function routeIntent(ctx, llmResponse) {
  switch (llmResponse.type) {
    case 'booking':
      await handleBooking(ctx, llmResponse);
      break;

    case 'free_masters':
    case 'all_availability':
    case 'date_availability':
    case 'staff_availability':
      const realSlots = await YcApi.getAvailableSlots(llmResponse.staff_id, llmResponse.date, 7);
      await ctx.reply(JSON.stringify(realSlots, null, 2));
      break;

    case 'message':
      await ctx.reply(llmResponse.msg);
      break;

    default:
      await ctx.reply('🤔 Неизвестный intent.');
  }
}
