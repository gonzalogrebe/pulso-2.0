// src/app/dashboard/Home.tsx (o en un archivo de interfaces globales)

interface Transaction {
    id: string;
    date: string;
    tipo: string;
    categoria: string;
    subcategoria?: string;
    item?: string;
    monto: number;
    descripcion?: string;
    provider_client?: string;
    payment_method?: string;
    reference?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  interface Presupuesto {
    id: string;
    date: string;
    tipo: 'Gasto' | 'Ingreso';
    categoria: string;
    subcategoria?: string;
    item?: string;
    monto: number;
    descripcion?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Alert {
    id: string;
    tipo: 'Gasto' | 'Ingreso';
    categoria: string;
    diferencia: number; // En porcentaje
    mensaje: string;
    fecha: string;
  }
  