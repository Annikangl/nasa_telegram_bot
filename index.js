const { Telegraf } = require('telegraf');
const axios = require('axios');

let config = require('./env.json');

const TELEGRAM_BOT_TOKEN = config.service.telegram_bot_key;
const NASA_API_KEY = config.service.nasa_api_key;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);


bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.username}! 
    Я бот, который работает в NASA! Могу предложить тебе астрономическую карту дня. 
    Просто напиши что-то мне`);
});

bot.help((ctx) => {
    ctx.reply('Если вы уже пресытились земными данными, не беда – отправляемся в космос вместе с NASA API.');
})

bot.catch((err) => {
    console.log(err)
});

bot.on('message', async (ctx) => {
    try {
        const apodObj = await axios.get('https://api.nasa.gov/planetary/apod?api_key=' + NASA_API_KEY);
        console.log(apodObj.data)

        if (apodObj.data) {
            ctx.reply(`Author: ${apodObj.data.copyright}\n Date: ${apodObj.data.date}\n Пояснение: ${apodObj.data.explanation}\n`)
            ctx.telegram.sendPhoto(ctx.chat.id, apodObj.data.url);
        }
    } catch (error){
        return ctx.reply('NASA сейчас не доступен :(');
    }
});

bot.launch();

