// src/data/dummyItems.ts
import { Item } from '@/types/items';

export const dummyItems: Item[] = [
  {
    id: '1',
    name: 'Salarios',
    type: 'expense',
    amount: 250000,
    date: '2024-01-07',
    category: 'Personal'
  },
  {
    id: '2',
    name: 'Cemento',
    type: 'expense',
    amount: 180000,
    date: '2024-01-07',
    category: 'Materiales'
  },
  {
    id: '3',
    name: 'Excavadora',
    type: 'expense',
    amount: 350000,
    date: '2024-01-07',
    category: 'Equipamiento'
  },
  {
    id: '4',
    name: 'Venta Apartamento 101',
    type: 'income',
    amount: 450000,
    date: '2024-01-07',
    category: 'Ventas'
  },
  {
    id: '5',
    name: 'Alquiler Local Comercial',
    type: 'income',
    amount: 75000,
    date: '2024-01-07',
    category: 'Alquileres'
  },
  {
    id: '6',
    name: 'Servicios de Consultoría',
    type: 'income',
    amount: 25000,
    date: '2024-01-07',
    category: 'Servicios'
  }
];