// src/utils/dataProcessing.ts

import { Transaction } from '../types/transaction';
import { TotalByTipo } from '../types/totalByTipo';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Filtra las transacciones dentro de un rango de fechas.
 */
export const filterTransactionsByDate = (
  transactions: Transaction[],
  startDate: Dayjs,
  endDate: Dayjs
): Transaction[] => {
  return transactions.filter((tx) => {
    const txDate = dayjs(tx.date);
    if (!txDate.isValid()) {
      console.warn(`Fecha inválida en transacción: ${tx.date}`);
      return false;
    }
    return (
      txDate.isSameOrAfter(startDate, 'day') &&
      txDate.isSameOrBefore(endDate, 'day')
    );
  });
};

/**
 * Calcula los totales de Gastos e Ingresos, incluyendo las categorías.
 */
export const calculateTotalByTipoAndCategoria = (
  transactions: Transaction[]
): TotalByTipo[] => {
  const tipos: { [tipo: string]: { total: number; categorias: { [categoria: string]: number } } } = {
    Gastos: { total: 0, categorias: {} },
    Ingresos: { total: 0, categorias: {} },
  };

  transactions.forEach((tx) => {
    if (tx.tipo === 'Gastos' || tx.tipo === 'Ingresos') {
      const tipo = tx.tipo;
      const categoria = tx.categoria || 'Sin Categoría'; // Manejar categorías vacías
      const monto = tx.monto;

      if (typeof monto !== 'number' || isNaN(monto)) {
        console.warn(`Monto inválido en transacción: ${monto}`);
        return;
      }

      // Actualizar el total por tipo
      tipos[tipo].total += monto;
      console.log(`Agregando ${tipo} - ${categoria}: ${monto}, Total actual: ${tipos[tipo].total}`);

      // Actualizar el total por categoría dentro del tipo
      if (tipos[tipo].categorias[categoria]) {
        tipos[tipo].categorias[categoria] += monto;
      } else {
        tipos[tipo].categorias[categoria] = monto;
      }
    }
  });

  // Transformar el objeto en un array de TotalByTipo
  return Object.keys(tipos).map((tipo) => ({
    tipo: tipo as 'Gastos' | 'Ingresos',
    total: tipos[tipo].total,
    categorias: Object.keys(tipos[tipo].categorias).map((categoria) => ({
      categoria,
      total: tipos[tipo].categorias[categoria],
    })),
  }));
};
