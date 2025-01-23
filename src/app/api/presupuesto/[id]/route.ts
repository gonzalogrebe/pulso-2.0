import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      console.error('ID no proporcionado en la solicitud');
      return NextResponse.json({ error: 'ID de presupuesto no proporcionado' }, { status: 400 });
    }

    console.log('Buscando presupuesto con ID:', id);

    // Depuración adicional para Prisma
    if (!prisma.tablaPresupuesto) {
      throw new Error('El modelo `TablaPresupuesto` no está definido en Prisma. Verifica el esquema.');
    }

    const presupuesto = await prisma.tablaPresupuesto.findUnique({
      where: { id },
    });

    if (!presupuesto) {
      console.error('Presupuesto no encontrado para ID:', id);
      return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }

    console.log('Presupuesto encontrado:', presupuesto);
    return NextResponse.json(presupuesto);
  } catch (error) {
    console.error('Error al buscar el presupuesto:', error);

    if (error instanceof Error) {
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
    }

    return NextResponse.json(
      { error: 'Error al cargar el presupuesto. Consulte los logs para más detalles.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      console.error('ID no proporcionado en la solicitud');
      return NextResponse.json({ error: 'ID de presupuesto no proporcionado' }, { status: 400 });
    }

    console.log('Actualizando presupuesto con ID:', id);

    if (!prisma.tablaPresupuesto) {
      throw new Error('El modelo `TablaPresupuesto` no está definido en Prisma. Verifica el esquema.');
    }

    const data = await request.json();

    const presupuesto = await prisma.tablaPresupuesto.update({
      where: { id },
      data: {
        date: new Date(data.date),
        tipo: data.tipo,
        categoria: data.categoria,
        subcategoria: data.subcategoria,
        item: data.item,
        monto: Number(data.monto),
        descripcion: data.descripcion,
      },
    });

    console.log('Presupuesto actualizado:', presupuesto);
    return NextResponse.json(presupuesto);
  } catch (error) {
    console.error('Error al actualizar el presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el presupuesto. Consulte los logs para más detalles.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      console.error('ID no proporcionado en la solicitud');
      return NextResponse.json({ error: 'ID de presupuesto no proporcionado' }, { status: 400 });
    }

    console.log('Eliminando presupuesto con ID:', id);

    if (!prisma.tablaPresupuesto) {
      throw new Error('El modelo `TablaPresupuesto` no está definido en Prisma. Verifica el esquema.');
    }

    await prisma.tablaPresupuesto.delete({
      where: { id },
    });

    console.log('Presupuesto eliminado exitosamente');
    return NextResponse.json({ message: 'Presupuesto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el presupuesto. Consulte los logs para más detalles.' },
      { status: 500 }
    );
  }
}
