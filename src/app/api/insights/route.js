import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Asegúrate de que la ruta sea correcta

export async function GET(request) {
  try {
    // Consulta para obtener el mayor gasto
    const mayorGasto = await prisma.transaction.findFirst({
      where: { tipo: 'Gastos' },
      orderBy: { monto: 'desc' },
    });

    // Consulta para calcular los ingresos totales
    const ingresosTotales = await prisma.transaction.aggregate({
      _sum: { monto: true },
      where: { tipo: 'Ingresos' },
    });

    // Cálculo de la desviación
    const desviacion = (ingresosTotales._sum.monto || 0) - 1200000;

    // Construcción del objeto de respuesta
    const insights = {
      mayorGasto: {
        monto: mayorGasto?.monto || 0,
        categoria: mayorGasto?.categoria || 'Sin datos',
        subcategoria: mayorGasto?.subcategoria || 'Sin datos',
      },
      ingresosTotales: ingresosTotales._sum.monto || 0,
      desviacion: desviacion || 0,
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error al obtener los datos de insights:', error);
    return NextResponse.json(
      { error: 'Error al obtener los datos de insights', details: error.message },
      { status: 500 }
    );
  }
}
