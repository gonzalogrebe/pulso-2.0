// src/pages/api/chart-data.js

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Asegúrate de que la ruta es correcta
import { parseISO, isValid, startOfMonth, endOfMonth, format, differenceInMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    console.log('Parámetros de Fecha Recibidos:', { startDateParam, endDateParam });

    let startDate;
    let endDate;

    if (startDateParam && endDateParam) {
      const parsedStart = parseISO(startDateParam);
      const parsedEnd = parseISO(endDateParam);

      console.log('Fechas Parseadas:', { parsedStart: parsedStart.toString(), parsedEnd: parsedEnd.toString() });

      if (!isValid(parsedStart) || !isValid(parsedEnd)) {
        return NextResponse.json(
          { error: 'Formato de fecha inválido. Usa YYYY-MM-DD.' },
          { status: 400 }
        );
      }

      // Ajustar las fechas al inicio y fin del mes correspondiente
      startDate = startOfMonth(parsedStart);
      endDate = endOfMonth(parsedEnd);
    } else {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Primer día del sexto mes atrás
      endDate = endOfMonth(today); // Último día del mes actual
      console.log('Rango de Fechas por Defecto:', { startDate, endDate });
    }

    console.log('Rango de Fechas para Consulta:', { startDate, endDate });

    // Obtener datos reales y presupuestados para Gastos e Ingresos
    const [expensesTransactions, expensesBudgets, incomesTransactions, incomesBudgets] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          tipo: {
            equals: 'Gastos', // Asegúrate de que los valores en la base de datos son exactamente 'Gastos' e 'Ingresos'
            mode: 'insensitive', // Hace que la comparación sea insensible a mayúsculas/minúsculas
          },
        },
      }),
      prisma.tablaPresupuesto.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          tipo: {
            equals: 'Gastos',
            mode: 'insensitive',
          },
        },
      }),
      prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          tipo: {
            equals: 'Ingresos',
            mode: 'insensitive',
          },
        },
      }),
      prisma.tablaPresupuesto.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          tipo: {
            equals: 'Ingresos',
            mode: 'insensitive',
          },
        },
      }),
    ]);

    console.log('Transactions obtenidas (Gastos):', expensesTransactions);
    console.log('Presupuestos obtenidos (Gastos):', expensesBudgets);
    console.log('Transactions obtenidas (Ingresos):', incomesTransactions);
    console.log('Presupuestos obtenidos (Ingresos):', incomesBudgets);

    // Generar etiquetas con formato 'Mes - Año'
    const labels = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      labels.push(`${format(current, 'LLLL - yyyy', { locale: es })}`);
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    console.log('Etiquetas Generadas:', labels);

    // Función para agrupar por mes usando differenceInMonths
    const groupByMonth = (data) => {
      const result = Array(labels.length).fill(0);
      data.forEach((item) => {
        if (!item.date || typeof item.monto !== 'number') {
          console.log('Item inválido:', item);
          return;
        }

        const itemDate = new Date(item.date);
        const monthIndex = differenceInMonths(itemDate, startDate);

        console.log(`Procesando item: ${itemDate} - monthIndex: ${monthIndex}`);

        if (monthIndex >= 0 && monthIndex < labels.length) {
          result[monthIndex] += item.monto;
          console.log(`Añadiendo monto: ${item.monto} al índice: ${monthIndex}`);
        } else {
          console.log(`Índice de mes fuera de rango: ${monthIndex} para la fecha ${itemDate}`);
        }
      });
      return result;
    };

    // Agrupar datos por mes
    const actualDataExpenses = groupByMonth(expensesTransactions);
    const budgetDataExpenses = groupByMonth(expensesBudgets);
    const actualDataIncomes = groupByMonth(incomesTransactions);
    const budgetDataIncomes = groupByMonth(incomesBudgets);

    console.log('Datos Procesados para el Gráfico:', {
      labels,
      expensesBudget: budgetDataExpenses,
      expensesActual: actualDataExpenses,
      incomesBudget: budgetDataIncomes,
      incomesActual: actualDataIncomes,
    });

    // Preparar la respuesta JSON
    return NextResponse.json({
      labels,
      expenses: {
        budget: budgetDataExpenses,
        actual: actualDataExpenses,
      },
      incomes: {
        budget: budgetDataIncomes,
        actual: actualDataIncomes,
      },
    });
  } catch (error) {
    console.error('Error al generar los datos del gráfico:', error);
    return NextResponse.json(
      { error: 'Error al generar los datos del gráfico', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
