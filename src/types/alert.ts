// src/types/alert.ts

export interface Alert {
    id: string;
    tipo: 'Gastos' | 'Ingresos'; // Plural
    categoria: string;
    diferencia: number; // En porcentaje
    mensaje: string;
    fecha: string;
  }
  