import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PresupuestoInput {
  date: string;
  tipo: string;
  categoria: string;
  subcategoria: string;
  item: string;
  monto: number;
  descripcion: string;
}

export async function GET() {
  try {
    const presupuestos = await prisma.tablaPresupuesto.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(presupuestos, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al listar presupuestos:', error.message);
      return NextResponse.json(
        {
          error: 'Error al listar presupuestos',
          details: error.message
        },
        { status: 500 }
      );
    }
    console.error('Error desconocido al listar presupuestos:', error);
    return NextResponse.json(
      {
        error: 'Error desconocido al listar presupuestos'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: PresupuestoInput = await request.json();

    const presupuestoCreado = await prisma.tablaPresupuesto.create({
      data: {
        date: new Date(data.date),
        tipo: data.tipo,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        item: data.item,
        monto: data.monto,
        descripcion: data.descripcion
      }
    });

    return NextResponse.json(presupuestoCreado, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al crear el presupuesto:', error.message);
      return NextResponse.json(
        {
          error: 'Error al crear el presupuesto',
          details: error.message
        },
        { status: 500 }
      );
    }
    console.error('Error desconocido al crear el presupuesto:', error);
    return NextResponse.json(
      {
        error: 'Error desconocido al crear el presupuesto'
      },
      { status: 500 }
    );
  }
}
