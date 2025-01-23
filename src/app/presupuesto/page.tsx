// src/app/presupuesto/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PresupuestoForm from './PresupuestoForm';

interface Presupuesto {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  subcategoria?: string;
  item?: string;
  monto: number;
  descripcion?: string;
}

export default function PresupuestoPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/presupuesto');
      if (!response.ok) throw new Error('Error al cargar los presupuestos');
      const data = await response.json();
      setPresupuestos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const handleEdit = (presupuesto: Presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedPresupuesto(null);
    setIsFormOpen(false);
  };

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0);
  };

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    return (
      (!filters.tipo || presupuesto.tipo === filters.tipo) &&
      (!filters.categoria || presupuesto.categoria.toLowerCase().includes(filters.categoria.toLowerCase())) &&
      (!filters.dateFrom || new Date(presupuesto.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(presupuesto.date) <= new Date(filters.dateTo))
    );
  });

  const paginatedPresupuestos = filteredPresupuestos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Presupuestos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nuevo Presupuesto
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Tipo"
            value={filters.tipo}
            onChange={handleFilterChange('tipo')}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Gastos">Gastos</MenuItem>
            <MenuItem value="Ingresos">Ingresos</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Categoría"
            value={filters.categoria}
            onChange={handleFilterChange('categoria')}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            fullWidth
            label="Desde"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={handleFilterChange('dateFrom')}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            fullWidth
            label="Hasta"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={handleFilterChange('dateTo')}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Subcategoría</TableCell>
                  <TableCell>Ítem</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPresupuestos.map(presupuesto => (
                  <TableRow key={presupuesto.id}>
                    <TableCell>{new Date(presupuesto.date).toLocaleDateString('es-CL')}</TableCell>
                    <TableCell>{presupuesto.tipo}</TableCell>
                    <TableCell>{presupuesto.categoria}</TableCell>
                    <TableCell>{presupuesto.subcategoria || '-'}</TableCell>
                    <TableCell>{presupuesto.item || '-'}</TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP'
                      }).format(presupuesto.monto)}
                    </TableCell>
                    <TableCell>{presupuesto.descripcion || '-'}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(presupuesto)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPresupuestos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => setRowsPerPage(parseInt(event.target.value, 10))}
              labelRowsPerPage="Filas por página"
            />
          </TableContainer>
        </>
      )}

      <PresupuestoForm
        open={isFormOpen}
        onClose={handleClose}
        onPresupuestoAdded={() => {
          setPage(0); // Reset to the first page after an update
          fetchPresupuestos();
        }}
        isEditing={!!selectedPresupuesto}
        presupuestoId={selectedPresupuesto?.id}
      />
    </Box>
  );
}
