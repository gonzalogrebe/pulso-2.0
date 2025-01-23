// src/app/income/[category]/page.tsx
'use client';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { use } from 'react';

const categoryNames: { [key: string]: string } = {
  sales: 'Ventas',
  rentals: 'Alquileres',
  services: 'Servicios'
};

export default function IncomeCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryTitle = categoryNames[resolvedParams.category] || resolvedParams.category;

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Ingresos - {categoryTitle}
        </Typography>
        <ItemsManager
          defaultFilter="income"
          defaultCategory={categoryTitle}
        />
      </Box>
    </DashboardLayout>
  );
}