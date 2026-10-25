// backend/middleware/apiKeyMiddleware.js

const apiKeyMiddleware = (req, res, next) => {
  // 1. Ambil API Key dari header request 'x-api-key'
  const clientApiKey = req.headers['x-api-key'];

  // 2. Ambil Kunci Rahasia resmi dari .env backend
  const validApiKey = process.env.API_KEY_EXTERNAL || 'dafatih_external_secret_key_2026';

  // 3. Periksa apakah API Key dikirim dan nilainya cocok
  if (!clientApiKey || clientApiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak! API Key tidak ditemukan atau tidak valid.'
    });
  }

  // 4. Jika cocok, izinkan request berlanjut
  next();
};

module.exports = apiKeyMiddleware;
