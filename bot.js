require('./env.js')
var apiKey = process.env['YANDEX_API_KEY'];
var token = process.env['TELEGRAM_BOT_TOKEN'];
var https = require('https');

var Bot = require('node-telegram-bot-api'),
    bot = new Bot(token, { polling: true });

console.log('bot server started...');


bot.onText(/^\/translate (.+)$/, function (msg, match) {
  var text = match[1];
  translateText(text, msg)

});

function translateText(text, msg){
  var options = {
    hostname: 'translate.yandex.net',
    port: 443,
    path: '/api/v1.5/tr.json/translate?key=' + apiKey +
    '&text=' + escape(text) +
    '&lang=en-de' +
    '&format=plain'
  };
  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);

    res.on('data', (d) => {
      var text = JSON.parse(d.toString()).text[0];
      console.log(text);
      bot.sendMessage(msg.chat.id, text)
    });
  });
  req.end();
}
// translateText('how are you')
