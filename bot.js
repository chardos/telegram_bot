require('./env.js')
var translate = require('./translation.js')
var token = process.env['TELEGRAM_BOT_TOKEN'];


var Bot = require('node-telegram-bot-api'),
    bot = new Bot(token, { polling: true });

console.log('bot server started...');


bot.onText(/^\/translate (.+)$/, function (msg, match) {
  var text = match[1];
  var chatId = msg.chat.id;
  // detectLanguage(text)
  translate(text, chatId, bot)
});



// detectLanguage('Wann kommen Sie vorbei?')
