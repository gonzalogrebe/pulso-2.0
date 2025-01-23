'use client';
import { Paper, Typography, Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeChartProps {
  viewType: 'months' | 'yearly';
  selectedPeriods: string[];
  selectedYear: number;
  compareEnabled: boolean;
  comparisonYear: number;
}

export default function IncomeChart({
  viewType,
  selectedPeriods,
  selectedYear,
  compareEnabled,
  comparisonYear
}: IncomeChartProps) {
  const monthlyData = {
    budget: [1200000, 1300000, 1250000, 1400000, 1350000, 1450000],
    actual: [1150000, 1250000, 1300000, 1380000, 1400000, 1420000]
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
        label: 'Ingresos Presupuestados',
        data: monthlyData.budget,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ingresos Reales',
        data: monthlyData.actual,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          afterBody: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const variance = variances[dataIndex];
            return `Discrepancia: ${variance.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP'
            })}`;
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
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        }
      },
    },
    layout: {
      padding: {
        top: 30
      }
    }
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

        ctx.fillStyle = variance >= 0 ? '#2e7d32' : '#d32f2f';

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

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        Ingresos
      </Typography>
      <Box sx={{
        height: {
          xs: '300px',
          sm: '400px'
        }
      }}>
        <Bar data={data} options={options} plugins={[variancePlugin]} />
      </Box>
    </Paper>
  );
}