import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error al cargar las transacciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(data.date),
        tipo: data.tipo,
        categoria: data.categoria,
        glosa: data.glosa,
        t: data.t,
        monto: Number(data.monto),
        numero_cta: data.numero_cta,
      }
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Error al crear la transacción' },
      { status: 500 }
    );
  }
}