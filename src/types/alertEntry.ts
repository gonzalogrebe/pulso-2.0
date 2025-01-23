// src/types/alertEntry.ts

export interface AlertEntry {
    tipo: 'Gastos' | 'Ingresos';
    categoria: string;
    real: number;
    presupuesto: number;
    percentageDifference: number; // Nueva propiedad
  }
  