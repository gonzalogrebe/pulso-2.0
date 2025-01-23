// src/components/dashboard/ExpensesChart.tsx
'use client';
import { Paper, Typography, Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ExpensesChartProps {
  viewType: 'months' | 'yearly';
  selectedPeriods: string[];
  selectedYear: number;
  compareEnabled: boolean;
  comparisonYear: number;
}

export default function ExpensesChart({
  viewType,
  selectedPeriods,
  selectedYear,
  compareEnabled,
  comparisonYear
}: ExpensesChartProps) {
  const monthlyData = {
    budget: [650000, 700000, 680000, 720000, 690000, 730000],
    actual: [630000, 710000, 690000, 700000, 710000, 720000]
  };

  const getLast6Months = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const labels = [];
    const currentMonth = new Date().getMonth();

    for (let i = 5; i >= 0; i--) {
      let monthIndex = currentMonth - i;
      if (monthIndex < 0) monthIndex += 12;
      labels.push(months[monthIndex]);
    }

    return labels;
  };

  const labels = getLast6Months();

  const variances = monthlyData.actual.map((actual, index) =>
    actual - monthlyData.budget[index]
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Gastos Presupuestados',
        data: monthlyData.budget,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Gastos Reales',
        data: monthlyData.actual,
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const variancePlugin: Plugin = {
    id: 'varianceLabels',
    afterDatasetsDraw(chart) {
      const { ctx, data, chartArea } = chart;
      const dataset = data.datasets[1];

      ctx.font = '11px Arial';
      ctx.textAlign = 'center';

      dataset.data.forEach((value: number, index: number) => {
        const variance = variances[index];
        const dataPoint = chart.getDatasetMeta(1).data[index];

        ctx.fillStyle = variance <= 0 ? '#2e7d32' : '#d32f2f';

        const formattedVariance = Math.abs(variance).toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });

        ctx.fillText(formattedVariance, dataPoint.x, dataPoint.y - 20);
      });
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return value.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0
            });
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return value.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0
            });
          }
        }
      }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Gastos
      </Typography>
      <Box sx={{
        height: {
          xs: '300px',
          sm: '400px'
        }
      }}>
        <Line data={data} options={options} plugins={[variancePlugin]} />
      </Box>
    </Paper>
  );
}