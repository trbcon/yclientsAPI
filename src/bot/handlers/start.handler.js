export async function onStart(ctx) {
  try {
    const userName = ctx.from.first_name || 'друг';

    const welcomeMessage = `
Привет, ${userName}! 👋
Я бот для записи на услуги через Yclients.
Просто напиши, на какую услугу хочешь записаться, и я помогу.
`;

    await ctx.reply(welcomeMessage);
  } catch (err) {
    console.error('❌ Ошибка в /start handler:', err);
    await ctx.reply('Произошла ошибка, попробуйте ещё раз.');
  }
}
