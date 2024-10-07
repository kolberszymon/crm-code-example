const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function main() {
  const { Argon2id } = await import('oslo/password');

  const hasher = new Argon2id()
  const hashedPassword = await hasher.hash('test12345')

  console.log(hashedPassword)

  const admin = await prisma.user.upsert({
    where: { email: 'biuro@monlib.pl' },
    update: {},
    create: {
      email: 'biuro@monlib.pl',
      hashedPassword,
      role: 'ADMIN',
      merchantData: {
        create: {
          merchantName: 'Monlib',
          accountType: 'Admin'
        }
      }
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })