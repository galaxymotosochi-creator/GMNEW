// Telegram отправка через сервер (SSH) — не через браузер
// Без внешних зависимостей

const TOKEN = '7471473926:AAE_kyz1Qtb1J8Dddqk1aaxzBGfMQ73lSMM';
const CHAT_ID = '5368408796';

// Можно вызывать из командной строки: node tg-send.js "текст сообщения"
const msg = process.argv[2];
if (msg) {
  const https = require('https');
  const data = JSON.stringify({chat_id: CHAT_ID, text: msg});
  const req = https.request({
    hostname: 'api.telegram.org',
    path: '/bot' + TOKEN + '/sendMessage',
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Content-Length': data.length}
  }, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => console.log('TG ответ:', body));
  });
  req.on('error', e => console.error('TG ошибка:', e));
  req.write(data);
  req.end();
}
