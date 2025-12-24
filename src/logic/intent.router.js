import { sendToAI } from '../ai/openrouter.client.js'
import { bookingFlow } from './booking.flow.js'

export const handleIntent = async (chatId, text) => {
  const session = conversationManager.get(chatId)
  const ctx = session.ctx

  const aiRaw = await sendToAI(chatId, text)

  let intent
  try {
    intent = JSON.parse(aiRaw)
  } catch {
    return ctx.reply(aiRaw)
  }

  if (intent.type === 'booking') {
    return bookingFlow(chatId, intent)
  }

  if (intent.type === 'message') {
    return ctx.reply(intent.msg)
  }

  return ctx.reply('Не понял запрос 🤔')
}
