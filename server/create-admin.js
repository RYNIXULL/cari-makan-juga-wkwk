const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: email,
        password: hashedPassword,
        role: 'admin'
      }
    });
    console.log('BERHASIL: Akun Admin baru telah dibuat!');
  } else {
    await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });
    console.log('BERHASIL: Akun yang sudah ada telah diubah menjadi Admin!');
  }
  
  console.log('Email: admin@admin.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
