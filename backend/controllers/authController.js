const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kunci Rahasia JWT (Membaca dari .env dengan fallback yang seragam)
const JWT_SECRET = process.env.JWT_SECRET || 'dafatih_secret_key_2026';

// Helper format data admin
const formatAdmin = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || 'Admin',
    email: user.email || '',
    role: user.role || 'admin',
    created_at: user.created_at || user.createdAt || null
  };
};

// Opsi Keamanan HttpOnly Cookie
const COOKIE_OPTIONS = {
  httpOnly: true, // Mencegah akses cookie via JavaScript frontend (Sangat Aman dari XSS)
  secure: process.env.NODE_ENV === 'production', // Menggunakan HTTPS saat mode produksi
  sameSite: 'lax', // Perlindungan dari serangan CSRF
  maxAge: 24 * 60 * 60 * 1000 // Masa berlaku cookie (1 hari)
};

// 1. Register Admin
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = name ? name.trim() : email.split('@')[0];

    const newAdmin = await prisma.user.create({
      data: {
        name: fullName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'admin'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi admin berhasil!',
      data: formatAdmin(newAdmin)
    });
  } catch (error) {
    console.error('Error Register Admin:', error);
    res.status(500).json({ success: false, message: 'Gagal registrasi: ' + error.message });
  }
};

// 2. Login Admin (Diperbarui dengan HttpOnly Cookie)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    const currentRole = String(user.role || '').toLowerCase().trim();
    if (currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak! Halaman ini khusus untuk Administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Kirim token melalui HttpOnly Cookie secara aman
    res.cookie('token', token, COOKIE_OPTIONS);

    // Mengembalikan respons tanpa melampirkan token di body
    res.json({
      success: true,
      message: 'Login Admin berhasil!',
      data: formatAdmin(user)
    });
  } catch (error) {
    console.error('Error Login Admin:', error);
    res.status(500).json({ success: false, message: 'Gagal login: ' + error.message });
  }
};

// 3. Logout Admin
const logout = async (req, res) => {
  try {
    // Hapus cookie token dari browser dengan opsi yang selaras
    res.clearCookie('token', {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite
    });

    res.json({
      success: true,
      message: 'Logout berhasil, sesi telah dihapus!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal logout: ' + error.message });
  }
};

// 4. Get Admin Profile
const getProfile = async (req, res) => {
  try {
    // Membaca email dari token (req.user) atau dari query parameter
    const email = req.user?.email || req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib disertakan.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
    }

    res.json({ success: true, data: formatAdmin(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil profil: ' + error.message });
  }
};

// 5. Update Admin Profile
const updateProfile = async (req, res) => {
  try {
    const { currentEmail, name, newEmail, oldPassword, newPassword } = req.body;

    // Gunakan email dari req.user jika currentEmail tidak diberikan
    const targetEmail = currentEmail || req.user?.email;

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'Current Email wajib diisi!' });
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
    }

    const updatedName = name ? name.trim() : user.name;
    const updatedEmail = newEmail ? newEmail.toLowerCase().trim() : user.email;

    const updateData = {
      name: updatedName,
      email: updatedEmail
    };

    if (newPassword && newPassword.trim() !== '') {
      const isOldMatch = await bcrypt.compare(oldPassword || '', user.password);
      if (!isOldMatch) {
        return res.status(400).json({ success: false, message: 'Password lama Anda salah!' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      data: formatAdmin(updatedUser),
      updatedEmail: updatedEmail
    });
  } catch (error) {
    console.error('Error pada updateProfile:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  registerAdmin: register,
  loginAdmin: login,
  getProfile,
  updateProfile
};
