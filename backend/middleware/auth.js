const jwt = require('jsonwebtoken');

// Kunci rahasia JWT (Membaca dari .env atau nilai standar)
const JWT_SECRET = process.env.JWT_SECRET || 'dafatih_secret_key_2026';

/**
 * 1. Middleware Verifikasi Token JWT
 * Memeriksa token dari HttpOnly Cookie (Web Browser) atau Header Authorization (Mobile/Postman)
 */
const authenticateToken = (req, res, next) => {
  try {
    // A. Cari token dari HttpOnly Cookie terlebih dahulu
    let token = req.cookies?.token;

    // B. Jika tidak ada di cookie, cari dari Header Authorization (Bearer <TOKEN>)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // C. Jika token tidak ditemukan sama sekali
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak! Token otentikasi tidak ditemukan. Silakan login terlebih dahulu.'
      });
    }

    // D. Verifikasi keabsahan token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan data pengguna ke dalam objek request

    next(); // Melanjutkan ke handler/controller berikutnya
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluwarsa. Silakan login kembali.'
    });
  }
};

/**
 * 2. Middleware Khusus Peran Admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Sesi otentikasi tidak valid.'
    });
  }

  // Normalisasi string role agar aman dari perbedaan huruf besar/kecil
  const role = String(req.user.role || '').toLowerCase().trim();
  if (role === 'admin' || role === 'super_admin' || role === 'superadmin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Akses ditolak! Fitur ini khusus untuk Administrator.'
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  isAdmin: requireAdmin // Alias agar kompatibel dengan pemanggilan isAdmin di file lain
};
