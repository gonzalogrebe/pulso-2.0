'use client';

import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <html lang="es">
      <body>
        <Box sx={{ display: 'flex' }}>
          {/* AppBar móvil */}
          <AppBar
            position="fixed"
            sx={{
              display: { sm: 'none' },
              width: '100%',
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="abrir menú"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <Sidebar
            mobileOpen={mobileOpen}
            onMobileClose={handleDrawerToggle}
          />

          {/* Contenido Principal */}
          <Box
  component="main"
  className="main-content"
  sx={{
    flexGrow: 1,
    padding: 3,
    marginLeft: { sm: '0px !important' }, // Aplicado con !important
    marginTop: { xs: '64px', sm: 0 },
    backgroundColor: '#f5f5f5',
    overflowX: 'hidden',
  }}
>
  {children}
</Box>
        </Box>
      </body>
    </html>
  );
}
