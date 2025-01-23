import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Iniciando consulta de categorías...');

    // Datos mock por defecto
    const defaultHierarchy = {
      'Gastos': {
        'Materiales': ['Cemento', 'Arena', 'Piedra'],
        'Mano de Obra': ['Albañil', 'Electricista', 'Plomero'],
        'Equipos': ['Alquiler', 'Compra', 'Mantenimiento']
      },
      'Ingresos': {
        'Ventas': ['Departamentos', 'Casas', 'Terrenos'],
        'Servicios': ['Consultoría', 'Gestión de Obra']
      }
    };

    try {
      const transactions = await prisma.transaction.findMany({
        select: {
          tipo: true,
          categoria: true,
          subcategoria: true,
        },
        where: {
          AND: [
            { tipo: { not: null } },
            { categoria: { not: null } }
          ]
        },
      });

      console.log('Transacciones encontradas:', transactions);

      if (transactions.length === 0) {
        console.log('No se encontraron transacciones, usando datos por defecto');
        return new NextResponse(JSON.stringify(defaultHierarchy), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const hierarchy: { [key: string]: { [key: string]: string[] } } = {};

      transactions.forEach(trans => {
        const { tipo, categoria, subcategoria } = trans;
        if (tipo && categoria) {
          if (!hierarchy[tipo]) {
            hierarchy[tipo] = {};
          }
          if (!hierarchy[tipo][categoria]) {
            hierarchy[tipo][categoria] = [];
          }
          if (subcategoria && !hierarchy[tipo][categoria].includes(subcategoria)) {
            hierarchy[tipo][categoria].push(subcategoria);
          }
        }
      });

      console.log('Jerarquía construida:', hierarchy);

      return new NextResponse(JSON.stringify(hierarchy), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });

    } catch (prismaError) {
      console.error('Error de Prisma:', prismaError);
      return new NextResponse(JSON.stringify(defaultHierarchy), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

  } catch (error) {
    console.error('Error general:', error);
    return new NextResponse(JSON.stringify({
      'Gastos': {
        'Materiales': ['Cemento', 'Arena', 'Piedra']
      },
      'Ingresos': {
        'Ventas': ['Departamentos', 'Casas', 'Terrenos']
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}