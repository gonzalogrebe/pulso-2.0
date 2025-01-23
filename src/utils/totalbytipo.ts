// src/utils/totalByTipo.ts

import { Transaction } from '../types/transaction';
import { TotalByTipo } from '../types/totalByTipo';
import dayjs from 'dayjs';

/**
 * Función para capitalizar la primera letra de una cadena.
 * @param str - Cadena a capitalizar.
 * @returns Cadena con la primera letra en mayúsculas.
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Transforma las transacciones en una estructura totalizada por tipo, año y mes.
 * @param transactions - Array de transacciones filtradas.
 * @returns Array de totales por tipo, año y mes.
 */
export function transformTransactions(transactions: Transaction[]): TotalByTipo[] {
  const tipoMap: {
    [tipo: string]: {
      [year: number]: {
        [month: number]: {
          total: number;
          categorias: { nombre: string; total: number }[];
        };
      };
    };
  } = {};

  transactions.forEach((tx) => {
    const rawTipo = tx.tipo; // Por ejemplo, "INGRESOS" o "GASTOS"
    const tipo = capitalizeFirstLetter(rawTipo); // "Ingresos" o "Gastos"
    const date = dayjs(tx.date);
    const year = date.year();
    const month = date.month() + 1; // dayjs months are 0-indexed

    if (!tipoMap[tipo]) {
      tipoMap[tipo] = {};
    }

    if (!tipoMap[tipo][year]) {
      tipoMap[tipo][year] = {};
    }

    if (!tipoMap[tipo][year][month]) {
      tipoMap[tipo][year][month] = { total: 0, categorias: [] };
    }

    tipoMap[tipo][year][month].total += tx.monto;

    const categoriaIndex = tipoMap[tipo][year][month].categorias.findIndex(
      (c) => c.nombre === tx.categoria
    );
    if (categoriaIndex !== -1) {
      tipoMap[tipo][year][month].categorias[categoriaIndex].total += tx.monto;
    } else {
      tipoMap[tipo][year][month].categorias.push({ nombre: tx.categoria, total: tx.monto });
    }
  });

  const result: TotalByTipo[] = [];

  for (const tipo in tipoMap) {
    for (const year in tipoMap[tipo]) {
      for (const month in tipoMap[tipo][year]) {
        const data = tipoMap[tipo][year][month];
        result.push({
          tipo,
          year: parseInt(year),
          month: parseInt(month),
          total: data.total,
          categorias: data.categorias,
        });
      }
    }
  }

  return result;
}
