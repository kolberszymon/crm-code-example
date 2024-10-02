const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const { Argon2id } = await import('oslo/password');
  const hasher = new Argon2id();
  const hashedPassword = await hasher.hash('your_admin_password');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      hashedPassword: hashedPassword,
      role: 'ADMIN',
      // Add any other necessary fields
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });