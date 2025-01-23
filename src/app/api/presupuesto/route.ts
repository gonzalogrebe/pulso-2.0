import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Devuelve todos los presupuestos (ajusta a tu preferencia)
    const presupuestos = await prisma.tablaPresupuesto.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(presupuestos, { status: 200 });
  } catch (error: any) {
    console.error('Error al listar presupuestos:', error);
    return NextResponse.json(
      {
        error: 'Error al listar presupuestos',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST -> Crear un nuevo presupuesto
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Crea el nuevo presupuesto
    const presupuestoCreado = await prisma.tablaPresupuesto.create({
      data: {
        date: new Date(data.date),
        tipo: data.tipo,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        item: data.item,
        monto: Number(data.monto),
        descripcion: data.descripcion
      }
    });

    // Devuelve el presupuesto creado con código 201 (created)
    return NextResponse.json(presupuestoCreado, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear el presupuesto:', error);
    return NextResponse.json(
      {
        error: 'Error al crear el presupuesto',
        details: error.message
      },
      { status: 500 }
    );
  }
}
