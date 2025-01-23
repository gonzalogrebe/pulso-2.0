'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import { useRouter, usePathname } from 'next/navigation';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';



const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon?: React.ReactElement;
  path: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    text: 'Panel de Control',
    icon: <DashboardIcon />,
    path: '/'
  },
  {
    text: 'Gastos',
    icon: <MoneyOffIcon />,
    path: '/expenses'
  },
  {
    text: 'Ingresos',
    icon: <AttachMoneyIcon />,
    path: '/income'
  },
  {
    text: 'Transacciones',
    icon: <AccountBalanceWalletIcon />,
    path: '/transactions'
  },

  {
    text: 'Ingresar Transacciones',
    icon: <CloudUploadIcon />, // Puedes elegir un icono más apropiado si lo deseas
    path: '/excel-uploader'
  },
  // Nuevo ítem: Base Presupuesto
  {
    text: 'Presupuesto',
    icon: <AccountBalanceIcon />, // Puedes elegir un icono más apropiado si lo deseas
    path: '/presupuesto'
  },

  {
    text: 'Gestión UF',
    icon: <AccountBalanceIcon />, // Puedes elegir un icono más apropiado si lo deseas
    path: '/admin/uf'
  },
 
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const handleClick = (item: MenuItem) => {
    if (item.subItems) {
      setOpenItems(prev => ({
        ...prev,
        [item.text]: !prev[item.text]
      }));
    }

    // Navegar a la ruta si existe, independientemente de si tiene subitems
    if (item.path) {
      router.push(item.path);
    }
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const isSelected = pathname === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openItems[item.text];

    return (
      <Box key={item.text}>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            pl: depth > 0 ? 1 : 0
          }}
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => handleClick(item)}
            sx={{
              minHeight: 40,
              px: 2,
              pl: depth * 2 + 2,
              backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: depth > 0 ? 30 : 36
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: depth > 0 ? '0.875rem' : '1rem'
              }}
              sx={{ opacity: 1 }}
            />
            {hasSubItems && (
              isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
            )}
          </ListItemButton>
        </ListItem>

        {hasSubItems && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                pl: depth > 0 ? 1 : 0
              }}
            >
              {item.subItems.map(subItem => renderMenuItem(subItem, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          height: '64px'
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          PULSO
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.7rem',
            color: 'text.secondary',
            mt: 0.5
          }}
        >
          Desarrollo Gonzalo Grebe
        </Typography>
      </Box>

      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            height: '100vh',
            position: 'fixed',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
