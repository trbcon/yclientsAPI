import { Telegraf } from 'telegraf'
import { conversationManager } from '../logic/conversation.manager.js'
import { handleIntent } from '../logic/intent.router.js'

export const initBot = () => {
  const bot = new Telegraf(process.env.TG_TOKEN)

  bot.on('text', async (ctx) => {
    const chatId = ctx.chat.id

    // сохраняем ctx для дальнейших reply
    conversationManager.setCtx(chatId, ctx)

    await handleIntent(chatId, ctx.message.text)
  })

  bot.launch()
  console.log('🤖 Telegram bot started')

  return bot
}
