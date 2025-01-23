// src/utils/getUfValue.ts

import { UfValue } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';

/**
 * Obtiene el valor de UF para una fecha específica.
 * @param ufValues - Lista de valores de UF.
 * @param date - Fecha para la cual obtener el valor de UF.
 * @returns Valor de UF o `null` si no se encuentra.
 */
export function getUfValue(ufValues: UfValue[], date: Dayjs): number | null {
  const year = date.year();
  const month = date.month() + 1; // dayjs months are 0-indexed

  const uf = ufValues.find((u) => u.year === year && u.month === month);
  return uf ? uf.value : null;
}
