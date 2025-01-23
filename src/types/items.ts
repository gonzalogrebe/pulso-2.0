// src/types/items.ts
export type ItemType = 'income' | 'expense';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  amount: number;
  date: string;
  category?: string;
}