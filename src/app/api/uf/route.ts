// app/api/uf/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ufValues = await prisma.ufValue.findMany({
      orderBy: [
        { year: 'asc' },
        { month: 'asc' },
      ],
    });
    return NextResponse.json(ufValues, { status: 200 });
  } catch (error) {
    console.error('Error fetching UF values:', error);
    return NextResponse.json({ error: 'Error fetching UF values' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { year, month, value } = await request.json();

    // Validar los campos
    if (
      typeof year !== 'number' ||
      typeof month !== 'number' ||
      typeof value !== 'number' ||
      month < 1 ||
      month > 12
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Buscar si ya existe un valor para el año y mes
    const existingUf = await prisma.ufValue.findUnique({
      where: {
        year_month: {
          year,
          month,
        },
      },
    });

    if (existingUf) {
      // Actualizar el valor existente
      const updatedUf = await prisma.ufValue.update({
        where: { id: existingUf.id },
        data: { value },
      });
      return NextResponse.json(updatedUf, { status: 200 });
    } else {
      // Crear un nuevo valor de UF
      const newUf = await prisma.ufValue.create({
        data: {
          year,
          month,
          value,
        },
      });
      return NextResponse.json(newUf, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating UF value:', error);
    return NextResponse.json({ error: 'Error creating/updating UF value' }, { status: 500 });
  }
}

// Prisma schema needs to have a unique compound index for year and month
// Asegúrate de que en schema.prisma dentro del modelo UfValue tienes:
// @@unique([year, month])
