// src/types/totalByTipo.ts

export interface CategoriaTotal {
  nombre: string;
  total: number;
}

export interface TotalByTipo {
  tipo: 'Gastos' | 'Ingresos';
  total: number;
  categorias: CategoriaTotal[];
  date: string; // Agrega la propiedad date para manejar las fechas
}
