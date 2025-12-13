export async function onMessage(ctx) {
  try {
    const userId = ctx.from.id;
    const text = ctx.message.text;

    console.log(`📩 Сообщение от ${userId}: ${text}`);

    await ctx.reply(`Вы написали: "${text}"`);

  } catch (err) {
    console.error('❌ Ошибка в обработчике сообщений:', err);
    await ctx.reply('Произошла ошибка, попробуйте ещё раз.');
  }
}
