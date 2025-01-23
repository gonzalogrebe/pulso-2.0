import { prisma } from '../src/lib/prisma.js'; // Asegúrate de usar extensiones `.js`


async function main() {
  const users = await prisma.users.findMany(); // Ajusta 'users' al modelo de tu esquema
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
