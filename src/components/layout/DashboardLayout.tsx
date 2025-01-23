// src/components/layout/DashboardLayout.tsx

'use client';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const drawerWidth = 240;

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
