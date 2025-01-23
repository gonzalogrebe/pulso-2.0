// app/api/uf/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deletedUf = await prisma.ufValue.delete({
      where: { id },
    });
    return NextResponse.json(deletedUf, { status: 200 });
  } catch (error) {
    console.error('Error deleting UF value:', error);
    return NextResponse.json({ error: 'Error deleting UF value' }, { status: 500 });
  }
}
