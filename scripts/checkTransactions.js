// scripts/checkTransactions.js

import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';

const prisma = new PrismaClient();

async function checkTransactions() {
  const startDate = parseISO('2020-02-01');
  const endDate = parseISO('2020-03-13');

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      tipo: {
        equals: 'Gastos',
        mode: 'insensitive', // Hace que la comparación sea case-insensitive
      },
    },
  });

  if (transactions.length === 0) {
    console.log('No se encontraron transacciones para el rango de fechas y tipo especificado.');
  } else {
    console.log('Transacciones encontradas:', transactions);
  }
}

checkTransactions()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
