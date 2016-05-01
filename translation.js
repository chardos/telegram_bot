var Promise = require("bluebird");
var https = require('https');
var apiKey = process.env['YANDEX_API_KEY'];
var parseString = require('xml2js').parseString;

function translate(text, chatId, bot){
  detectLanguage(text);

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
      bot.sendMessage(chatId, text)
    });
  });
  req.end();
}

function detectLanguage(text){
  var options = {
    hostname: 'translate.yandex.net',
    port: 443,
    path: '/api/v1.5/tr/detect?key=' + apiKey +
    '&text=' + escape(text)
  };
  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);

    res.on('data', (data) => {
      var lang;
      parseString(data, (err, result) => {
        lang = result.DetectedLang.$.lang;
      });
      console.log('lang: ' + lang);



    });
  });
  req.end();
}



module.exports = translate;
