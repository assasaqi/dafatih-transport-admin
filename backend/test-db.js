// backend/test-db.js (Uji coba impor dari config/prisma)
const prisma = require('./config/prisma');

async function testImport() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 + 1 AS result;`;
    console.log('✅ Impor dari config/prisma.js BERHASIL dan konsisten!');
  } catch (err) {
    console.error('❌ Gagal menguji impor:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testImport();
