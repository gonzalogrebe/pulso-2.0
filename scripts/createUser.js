import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'g_grebe@hotmail.com';
  const password = '120580g';

  console.log('Cifrando la contraseña...');
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Creando usuario...');
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log('Usuario creado con éxito:', user);
}

main()
  .catch((e) => {
    console.error('Error al crear usuario:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
