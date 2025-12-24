import { conversationManager } from './conversation.manager.js'
import * as YcApi from '../yclients/bookings.api.js'

const REQUIRED_FIELDS = [
  'fullname',
  'phone',
  'staff_id',
  'service_ids',
  'time'
]

export const bookingFlow = async (chatId, intentData) => {
  const session = conversationManager.get(chatId)
  const ctx = session.ctx
  const state = session.state

  if (!ctx) return

  // инициализируем хранилище
  state.bookingData = state.bookingData || {}

  // 🔹 сохраняем всё, что пришло от AI
  for (const key of Object.keys(intentData)) {
    if (intentData[key] !== null && intentData[key] !== undefined) {
      state.bookingData[key] = intentData[key]
    }
  }

  // 🔹 проверяем недостающие поля
  for (const field of REQUIRED_FIELDS) {
    if (!state.bookingData[field]) {
      return askField(ctx, field)
    }
  }

  // 🔹 проверка совместимости мастер ↔ услуга
  try {
    const staffList = (await YcApi.getStaff()).data
    const servicesList = (await YcApi.getServices()).data

    const staff = staffList.find(s => s.id === state.bookingData.staff_id)
    if (!staff) {
      resetBooking(state)
      return ctx.reply('❌ Мастер не найден. Давайте попробуем ещё раз.')
    }

    const invalidService = state.bookingData.service_ids.find(
      sid => !servicesList.some(s => s.id === sid)
    )

    if (invalidService) {
      resetBooking(state)
      return ctx.reply('❌ Выбранная услуга недоступна. Уточните услугу.')
    }
  } catch (e) {
    console.error(e)
    return ctx.reply('❌ Ошибка проверки данных.')
  }

  // 🔹 создаём запись
  try {
    await YcApi.createBooking(state.bookingData)

    await ctx.reply(
      `✅ Запись успешно создана!\n\n` +
      `👤 Клиент: ${state.bookingData.fullname}\n` +
      `👨‍🔧 Мастер: ${state.bookingData.mname}\n` +
      `✂️ Услуга: ${state.bookingData.sname}\n` +
      `🕒 Время: ${state.bookingData.time}`
    )

    resetBooking(state)
  } catch (err) {
    console.error('❌ Booking error:', err)
    await ctx.reply('❌ Не удалось создать запись. Попробуйте позже.')
  }
}

function askField(ctx, field) {
  switch (field) {
    case 'fullname':
      return ctx.reply('Пожалуйста, укажите ваше полное имя.')
    case 'phone':
      return ctx.reply('Укажите номер телефона в формате +79998887766')
    case 'staff_id':
      return ctx.reply('К какому мастеру вы хотите записаться?')
    case 'service_ids':
      return ctx.reply('Какую услугу вы хотите?')
    case 'time':
      return ctx.reply('На какую дату и время? (YYYY-MM-DD HH:MM)')
    default:
      return ctx.reply('Пожалуйста, уточните данные.')
  }
}

function resetBooking(state) {
  delete state.bookingData
}
