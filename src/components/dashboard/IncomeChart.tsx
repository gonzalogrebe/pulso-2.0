// src/components/dashboard/IncomeChart.tsx
'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Plugin para mostrar diferencias
const variancePlugin: Plugin = {
  id: 'varianceLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[1]; // Dataset de "Ingresos Reales"

    if (!dataset || !dataset.data) return;

    ctx.font = '11px Arial';
    ctx.textAlign = 'center';

    dataset.data.forEach((value: number, index: number) => {
      const actual = chart.data.datasets![1].data[index] as number;
      const budget = chart.data.datasets![0].data[index] as number;
      const variance = actual - budget;

      // Cambiar color según el signo de la diferencia
      ctx.fillStyle = variance < 0 ? '#d32f2f' : '#2e7d32';

      // Formatear la diferencia con + o -
      const formattedVariance = `${variance < 0 ? '-' : '+'}${Math.abs(variance).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      })}`;

      // Dibujar la diferencia encima de la barra
      const dataPoint = chart.getDatasetMeta(1).data[index];
      if (dataPoint) {
        ctx.fillText(formattedVariance, dataPoint.x, dataPoint.y - 10);
      }
    });
  },
};

interface IncomeData {
  budget: number[];
  actual: number[];
}

interface IncomeChartProps {
  data: IncomeData;
  labels: string[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ data, labels, startDate, endDate }) => {
  console.log('IncomeChart Props:', { data, labels, startDate, endDate });

  // Verificar que 'data' y sus propiedades existen
  if (!data || !data.budget || !data.actual || !labels) {
    return <Typography>No hay datos disponibles para mostrar el gráfico de ingresos.</Typography>;
  }

  // Verificar que las longitudes de los arrays coinciden con las etiquetas
  if (data.budget.length !== labels.length || data.actual.length !== labels.length) {
    return <Typography>Los datos proporcionados no coinciden con las etiquetas.</Typography>;
  }

  const chartData = {
    labels: labels, // Usar etiquetas dinámicas
    datasets: [
      {
        label: 'Ingresos Presupuestados',
        data: data.budget,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ingresos Reales',
        data: data.actual,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
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
          afterBody: (context: any[]) => {
            const dataIndex = context[0].dataIndex;
            const variance = data.actual[dataIndex] - data.budget[dataIndex];
            return `Diferencia: ${variance.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
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
              maximumFractionDigits: 0,
            }),
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Ingresos {startDate && endDate ? `(${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')})` : ''}
      </Typography>
      <Box sx={{ height: '400px' }}>
        <Bar data={chartData} options={options} plugins={[variancePlugin]} />
      </Box>
    </Paper>
  );
};

export default IncomeChart;
