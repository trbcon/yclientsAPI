import { Telegraf } from 'telegraf';
import { config } from '../config/config.js';
import { onMessage } from './handlers/message.handler.js';
import { onStart } from './handlers/start.handler.js';

export function initBot() {
  const bot = new Telegraf(config.telegram.token);

  bot.start(onStart);

  bot.on('text', onMessage);

  bot.catch((err, ctx) => {
    console.error('❌ Ошибка в боте:', err);
    ctx.reply('Произошла ошибка, попробуйте ещё раз.');
  });

  bot.launch().then(() => {
    console.log(`✅ Telegram бот запущен в режиме ${config.env}`);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
