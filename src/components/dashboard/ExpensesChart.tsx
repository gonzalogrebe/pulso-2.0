'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ExpensesData {
  budget: number[];
  actual: number[];
}

interface ExpensesChartProps {
  data: ExpensesData;
  labels: string[];
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ data, labels }) => {
  if (!data || !data.budget || !data.actual || labels.length === 0) {
    return <Typography>No hay datos disponibles para mostrar el gráfico de gastos.</Typography>;
  }
  

  const chartData = {
    labels,
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
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Gastos
      </Typography>
      <Box sx={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default ExpensesChart;
