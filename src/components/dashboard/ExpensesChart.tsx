// src/components/dashboard/ExpensesChart.tsx
'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Plugin para mostrar la variación entre gastos presupuestados y reales
const variancePlugin: Plugin = {
  id: 'varianceLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[1]; // Dataset de "Gastos Reales"

    if (!dataset || !dataset.data) return;

    ctx.font = '11px Arial';
    ctx.textAlign = 'center';

    dataset.data.forEach((value: number, index: number) => {
      const actual = chart.data.datasets![1].data[index] as number;
      const budget = chart.data.datasets![0].data[index] as number;
      const variance = actual - budget;

      // Cambiar color según el signo de la diferencia
      ctx.fillStyle = variance <= 0 ? '#2e7d32' : '#d32f2f';

      // Formatear la diferencia con + o -
      const formattedVariance = `${variance < 0 ? '-' : '+'}${Math.abs(variance).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      })}`;

      // Obtener la posición del punto
      const dataPoint = chart.getDatasetMeta(1).data[index];
      if (dataPoint) {
        ctx.fillText(formattedVariance, dataPoint.x, dataPoint.y - 20);
      }
    });
  },
};

interface ExpensesData {
  budget: number[];
  actual: number[];
}

interface ExpensesChartProps {
  data: ExpensesData;
  labels: string[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ data, labels, startDate, endDate }) => {
  console.log('ExpensesChart Props:', { data, labels, startDate, endDate });

  // Verificar que 'data' y sus propiedades existen
  if (!data || !data.budget || !data.actual || !labels) {
    return <Typography>No hay datos disponibles para mostrar el gráfico de gastos.</Typography>;
  }

  // Verificar que las longitudes de los arrays coinciden con las etiquetas
  if (data.budget.length !== labels.length || data.actual.length !== labels.length) {
    return <Typography>Los datos proporcionados no coinciden con las etiquetas.</Typography>;
  }

  const chartData = {
    labels: labels, // Usar etiquetas dinámicas
    datasets: [
      {
        label: 'Gastos Presupuestados',
        data: data.budget,
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Gastos Reales',
        data: data.actual,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterBody: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex; // Índice del punto en el gráfico
            const actual = data.actual[index];
            const budget = data.budget[index];
            const diff = actual - budget;

            return `Diferencia: ${
              diff < 0
                ? `-${Math.abs(diff).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`
                : `+${diff.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`
            }`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) =>
            value.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
            }),
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Gastos {startDate && endDate ? `(${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')})` : ''}
      </Typography>
      <Box sx={{ height: '400px' }}>
        <Line data={chartData} options={options} plugins={[variancePlugin]} />
      </Box>
    </Paper>
  );
};

export default ExpensesChart;
