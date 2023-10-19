require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require("./options")

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Зараз я загадаю цифру від 0 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber.toString();
    await bot.sendMessage(chatId, 'Загадав! А тепер спробуй відгадати', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Початкове вітання"},
        {command: "/info", description: "Отримати інформацію про користувача"},
        {command: "/game", description: "Гра вгадай цифру"},
    ])

    bot.on('message', async msg => {
        const {text, chat: {id: chatId}, from: {first_name, last_name}} = msg;

        if (text === '/start') {
            await bot.sendMessage(chatId, "Вітаю у телеграм боті від Recipe Agency")
            return bot.sendSticker(chatId, "CAACAgIAAxkBAAMfZTGT71c0SUZ_PgFjRlAIww2b1nEAAgEBAAJWnb0KIr6fDrjC5jQwBA")
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебе звати ${first_name} ${last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебе не розумію😢\nСкористайся будь ласка якоюсь з наданих команд🙏')
    });

    bot.on('callback_query', async msg => {
        const {data, message: {chat: {id: chatId}}} = msg;

        if (data === '/again') {
            return startGame(chatId);
        }
        console.log("data: ", data);
        console.log("chats[chatId]: ", chats[chatId])
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Вітаю! ти відгадав цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Нажаль ти не вгадав, я загадував цифру ${chats[chatId]}`, againOptions)
        }
    })

    bot.on('polling_error', error => console.log(error));
}

start();
