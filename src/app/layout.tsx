// src/app/layout.tsx
'use client';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Sidebar, { drawerWidth } from '@/components/layout/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
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

          <Sidebar
            mobileOpen={mobileOpen}
            onMobileClose={handleDrawerToggle}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 4,
              width: {
                xs: '100%',
                sm: `calc(100% - ${drawerWidth}px)`
              },
              ml: { sm: `${drawerWidth}px` },
              mt: { xs: '64px', sm: 0 },
              minHeight: '100vh',
              backgroundColor: '#f5f5f5',
              overflowX: 'hidden'
            }}
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}