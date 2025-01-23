import { prisma } from '../../../lib/prisma';

export const functions = {
  // Función para obtener gastos por mes y año
  getMonthlyExpenses: async (mes: number, año: number) => {
    const inicio = new Date(`${año}-${mes.toString().padStart(2, '0')}-01`);
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + 1);

    const results = await prisma.transaction.aggregate({
      _sum: {
        monto: true,
      },
      where: {
        tipo: 'Gastos',
        date: {
          gte: inicio,
          lt: fin,
        },
      },
    });

    return results._sum.monto || 0;
  },

  // Función para calcular la diferencia entre años
  calculateDifferenceByYear: async (año1: number, año2: number) => {
    const [total1, total2] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: {
          monto: true,
        },
        where: {
          tipo: 'Gastos',
          date: {
            gte: new Date(`${año1}-01-01`),
            lt: new Date(`${año1}-12-31`),
          },
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          monto: true,
        },
        where: {
          tipo: 'Gastos',
          date: {
            gte: new Date(`${año2}-01-01`),
            lt: new Date(`${año2}-12-31`),
          },
        },
      }),
    ]);

    return {
      año1: total1._sum.monto || 0,
      año2: total2._sum.monto || 0,
      diferencia: (total2._sum.monto || 0) - (total1._sum.monto || 0),
    };
  },
};
