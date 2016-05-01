var Q = require("q");
var https = require('https');
var apiKey = process.env['YANDEX_API_KEY'];
var parseString = require('xml2js').parseString;

function translate(text, chatId, bot){
  detectLanguage(text).then(function(lang){
    var params = {text,chatId, bot, lang};
    translateText(params);
  });

}

function detectLanguage (text){
  var deferred = Q.defer();
  var options = {
    hostname: 'translate.yandex.net',
    port: 443,
    path: '/api/v1.5/tr/detect?key=' + apiKey +
    '&text=' + escape(text)
  };
  var req = https.request(options, (res) => {
    res.on('data', (data) => {
      var lang;
      parseString(data, (err, result) => {
        lang = result.DetectedLang.$.lang;
      });
      console.log('lang: ' + lang);
      deferred.resolve(lang);
    });
  });
  req.end();
  return deferred.promise;
}

function translateText(params){
  var options = {
    hostname: 'translate.yandex.net',
    port: 443,
    path: '/api/v1.5/tr.json/translate?key=' + apiKey +
    '&text=' + escape(params.text) +
    '&lang='+params.lang+'-en' +
    '&format=plain'
  };
  var req = https.request(options, (res) => {
    console.log('statusCode: ', res.statusCode);

    res.on('data', (d) => {
      var text = JSON.parse(d.toString()).text[0];
      console.log(text);
      params.bot.sendMessage(params.chatId, text)
    });
  });
  req.end();
}


module.exports = translate;
