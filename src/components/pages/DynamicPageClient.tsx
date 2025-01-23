// src/components/pages/DynamicPageClient.tsx
'use client';
import { Box, Typography, Button, Stack, Link } from '@mui/material';
import { useRouter } from 'next/navigation';

interface DynamicPageClientProps {
  type: string;
  section: string;
  category: string;
}

export default function DynamicPageClient({ type, section, category }: DynamicPageClientProps) {
  const router = useRouter();

  const typeMap: { [key: string]: string } = {
    'budget': 'Presupuesto',
    'actual': 'Real'
  };

  const sectionMap: { [key: string]: string } = {
    'expenses': 'Gastos',
    'income': 'Ingresos'
  };

  const categoryMap: { [key: string]: string } = {
    'personal': 'Personal',
    'materials': 'Materiales',
    'services': 'Servicios',
  };

  const handleTypeClick = () => {
    router.push(`/${type}`);
  };

  const handleSectionClick = () => {
    router.push(`/${type}/${section}`);
  };

  const handleCategoryClick = () => {
    router.push(`/${type}/${section}/${category}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
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
          <Link
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
            {typeMap[type] || type}
          </Link>
          {' - '}
          <Link
            component="span"
            onClick={handleSectionClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            {sectionMap[section] || section}
          </Link>
          {' - '}
          <Link
            component="span"
            onClick={handleCategoryClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            {categoryMap[category] || category}
          </Link>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
          >
            IMPORTAR EXCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
          >
            AGREGAR ITEM
          </Button>
        </Stack>
      </Box>

      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          {categoryMap[category] || category} - {sectionMap[section] || section}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{
            bgcolor: 'success.light',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1
          }}>
            Total Ingresos: $0
          </Box>
          <Box sx={{
            bgcolor: 'error.light',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1
          }}>
            Total Gastos: $50
          </Box>
          <Box sx={{
            bgcolor: 'info.light',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1
          }}>
            Balance: $-50
          </Box>
        </Stack>

        {/* Aquí irá tu tabla o lista de items */}
      </Box>
    </Box>
  );
}