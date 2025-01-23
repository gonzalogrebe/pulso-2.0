// src/types/categoryGroup.ts

export interface CategoriaDetalle {
    categoria: string;
    total: number;
  }
  
  export interface CategoryGroup {
    tipo: 'Gastos' | 'Ingresos';
    categorias: CategoriaDetalle[];
  }
  