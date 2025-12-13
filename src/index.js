import { config } from './config/config.js';
import { initBot } from './bot/bot.js';

initBot();
console.log(`✅ Бот запущен в режиме ${config.env}`);
