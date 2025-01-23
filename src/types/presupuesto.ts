// src/types/presupuesto.ts

export interface Presupuesto {
    id: string;
    date: string;
    tipo: 'Gastos' | 'Ingresos'; // Plural
    categoria: string;
    subcategoria?: string;
    item?: string;
    monto: number;
    descripcion?: string;
    createdAt: string;
    updatedAt: string;
  }
  