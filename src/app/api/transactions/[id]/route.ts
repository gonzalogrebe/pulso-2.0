import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Extraer id de forma segura

  try {
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Error al cargar la transacción' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const data = await request.json();

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        date: new Date(data.date),
        tipo: data.tipo,
        categoria: data.categoria,
        glosa: data.glosa,
        t: data.t,
        monto: Number(data.monto),
        numero_cta: data.numero_cta,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la transacción' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Transacción eliminada con éxito' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la transacción' },
      { status: 500 }
    );
  }
}
