// /components/summary/CategorySummary.tsx

import * as MUI from '@mui/material';

interface CategorySummaryProps {
  title: string;
  data: {
    budget: number;
    actual: number;
  };
  type: 'income' | 'expense';
}

export default function CategorySummary({ title, data, type }: CategorySummaryProps) {
  const variance = data.actual - data.budget;
  const percentage = data.budget !== 0 ? (variance / data.budget) * 100 : 0;

  return (
    <MUI.Paper sx={{ p: 2 }}>
      <MUI.Typography variant="h6">{title}</MUI.Typography>
      <MUI.Typography variant="body1">
        Presupuestado: {data.budget.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </MUI.Typography>
      <MUI.Typography variant="body1">
        Real: {data.actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </MUI.Typography>
      <MUI.Typography
        variant="body1"
        sx={{ color: variance > 0 ? 'error.main' : 'success.main' }}
      >
        Diferencia: {variance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} ({percentage.toFixed(1)}%)
      </MUI.Typography>
    </MUI.Paper>
  );
}
