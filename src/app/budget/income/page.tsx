// src/app/budget/income/page.tsx
'use client';
import { Box, Typography, Paper, Grid, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CategorySummary from '@/components/summary/CategorySummary';

export default function BudgetIncomePage() {
  const router = useRouter();

  const categories = [
    { id: 'ventas', name: 'Ventas', budget: 800000, actual: 750000 },
    { id: 'servicios', name: 'Servicios', budget: 400000, actual: 420000 },
    { id: 'otros', name: 'Otros Ingresos', budget: 100000, actual: 90000 },
  ];

  const totalSummary = {
    budget: categories.reduce((sum, cat) => sum + cat.budget, 0),
    actual: categories.reduce((sum, cat) => sum + cat.actual, 0)
  };

  const handleTypeClick = () => {
    router.push('/budget');
  };

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <MuiLink
            component="span"
            onClick={handleTypeClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            Presupuesto
          </MuiLink>
          {' - '}
          <span>Ingresos</span>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <CategorySummary
          title="Resumen Total Ingresos"
          data={totalSummary}
          type="income"
        />
      </Box>

      <Grid container spacing={2}>
        {categories.map(category => (
          <Grid item xs={12} md={4} key={category.id}>
            <Link
              href={`/budget/income/${category.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CategorySummary
                  title={category.name}
                  data={{
                    budget: category.budget,
                    actual: category.actual
                  }}
                  type="income"
                />
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}