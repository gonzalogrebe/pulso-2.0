// src/components/layout/PageContainer.tsx
import { Box, Typography, Paper } from '@mui/material';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 3,
          fontWeight: 500
        }}
      >
        {title}
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}