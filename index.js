/*https://tts.voicetech.yandex.net/generate?

  key=<API‑ключ>

& text=<текст>

& format=<mp3|wav|opus>

& [quality=<hi|lo>]

& lang=<ru-RU|en-US|uk-UK|tr-TR>

& speaker=<jane|oksana|alyss|omazh|zahar|ermil>

& [speed=<скорость речи>]

& [emotion=<good|neutral|evil>]
*/

const rp = require('request-promise');
const {URL} = require('url');
const fs = require('fs');
const config=require('./config/config.json');
const crypto = require('crypto');

function md5(data) {
  return crypto.createHash('md5').update(data).digest("hex");
}

function getFileName(params) {
  const fsMaxFnameLen = 170;
  let filename = `${__dirname}/tmp/${Object.values(params).join('-')}`;
  if (filename.length >= (fsMaxFnameLen - 4)) {
    const hash = md5(filename);
    filename = `${filename.substr(0, fsMaxFnameLen - hash.length - 4)}${hash}`;
  }
  return `${filename}.mp3`;
}

const text = 'Привет, друзья! Давайте поговорим про модную тему б+ега. Уже много-много лет модную! ' +
  'Я вот никогда не понимал в чем кайф убивать колени и вентилировать легкие выхлопным газом, но у каждого свой путь к радости... ' +
  'Если ваш лежит через бег, пройдите пожалуйста этот короткий опрос. ' +
  'А если опроса вам не хватило, можете рассказать мне, что я ничего не понимаю за бег прямо в комментах.';
const params = {emotion: 'evil', speaker: 'ermil', text};

const api = new URL('https://tts.voicetech.yandex.net/generate');
api.searchParams.set('key', config.key);
api.searchParams.set('format', 'mp3');
api.searchParams.set('quality', 'hi');
api.searchParams.set('lang', 'ru-RU');
api.searchParams.set('speaker', params.speaker);
api.searchParams.set('speed', '1');
api.searchParams.set('emotion', params.emotion);
api.searchParams.set('text', params.text);

const options = {
  url: api.href,
  encoding: null,
};


rp.get(options)
  .then(function (res) {
    const filename = getFileName(params);
    console.log(`Attempting to write ${filename}`);
    fs.writeFileSync(filename, res);
  });
