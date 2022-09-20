require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const test = () => {
    bot.sendMessage(process.env.CHAT_ID, 'test');
};

test();
