// backend/config/prisma.js
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
require('dotenv').config();

// 1. Buat pool koneksi MariaDB/MySQL menggunakan variabel lingkungan dari .env
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dafatih_transport_db',
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5,
});

// 2. Buat adapter Prisma untuk MariaDB
const adapter = new PrismaMariaDb(pool);

// 3. Instansiasi PrismaClient dengan mengoper adapter yang wajib di Prisma v7
const prisma = new PrismaClient({ adapter });

// 4. Ekspor instance Prisma agar konsisten digunakan di seluruh controller
module.exports = prisma;
