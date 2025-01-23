// src/types/transaction.ts

export interface Transaction {
  id: string;
  date: string; // Formato ISO: 'YYYY-MM-DD' o similar
  tipo: string; // 'Ingresos' o 'Gastos'
  categoria: string;
  subcategoria: string | null;
  item: string | null;
  glosa: string;
  t: string;
  numero_cta: number;
  monto: number;
  descripcion: string | null;
  provider_client: string | null;
  payment_method: string | null;
  reference: string | null;
  created_at: string;
  updated_at: string;
}
