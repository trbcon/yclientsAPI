import { conversationManager } from '../../logic/conversation.manager.js'
import { intentRouter } from '../../logic/intent.router.js'

export const onMessage = async (ctx) => {
  try {
    const chatId = ctx.chat.id
    const text = ctx.message.text

    conversationManager.setContext(chatId, ctx)
    conversationManager.addMessage(chatId, 'user', text)

    await intentRouter(chatId)
  } catch (err) {
    console.error(err)
    await ctx.reply('❌ Ошибка обработки сообщения')
  }
}
