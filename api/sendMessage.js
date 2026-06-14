// Vercel API — прокси для отправки в Telegram
// Принимает POST от браузера, отправляет запрос в Telegram Bot API
// Решает проблему блокировки api.telegram.org у российских провайдеров
module.exports = async (req, res) => {
  // CORS — чтобы браузер не блокировал
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const TOKEN = '7471473926:AAE_kyz1Qtb1J8Dddqk1aaxzBGfMQ73lSMM';
  const CHAT_ID = '5368408796';
  const { text, photo } = req.body || {};

  try {
    if (photo) {
      // Отправка фото
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            photo: photo,
            caption: text || ''
          })
        }
      );
      const data = await tgRes.json();
      return res.status(tgRes.ok ? 200 : 500).json(data);
    } else {
      // Отправка текста
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text || '',
            parse_mode: 'HTML'
          })
        }
      );
      const data = await tgRes.json();
      return res.status(tgRes.ok ? 200 : 500).json(data);
    }
  } catch (err) {
    console.error('TG proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
};
