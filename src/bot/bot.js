import { Telegraf } from 'telegraf'
import { conversationManager } from '../logic/conversation.manager.js'
import { handleIntent } from '../logic/intent.router.js'

export const initBot = () => {
  const bot = new Telegraf(process.env.TG_TOKEN)

  bot.on('text', async (ctx) => {
    if (!ctx) {
      console.error('ctx not found for chat:', chatId)
      return
    }

    const chatId = ctx.chat.id

    // сохраняем ctx для дальнейших reply
    conversationManager.setContext(chatId, ctx)

    await handleIntent(chatId, ctx.message.text)
  })

  bot.launch()
  console.log('🤖 Telegram bot started')

  return bot
}
