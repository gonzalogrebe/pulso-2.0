// src/app/base-presupuesto/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

interface Presupuesto {
  id: string;
  date: string; // Date stored as ISO string
  tipo: string;
  categoría: string;
  subcategoría?: string;
  item?: string;
  monto: number;
  descripción?: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  date: string;
  tipo: string;
  categoría: string;
  subcategoría?: string;
  item?: string;
  monto: number;
  descripción?: string;
}

const BasePresupuesto: React.FC = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editPresupuesto, setEditPresupuesto] = useState<Presupuesto | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      tipo: '',
      categoría: '',
      subcategoría: '',
      item: '',
      monto: 0,
      descripción: '',
    },
  });

  // Función para obtener todos los presupuestos
  const fetchPresupuestos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Presupuesto[]>('/api/tabla_presupuesto');
      setPresupuestos(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los presupuestos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  // Función para abrir el diálogo para crear o editar
  const handleOpenDialog = (presupuesto?: Presupuesto) => {
    if (presupuesto) {
      setEditPresupuesto(presupuesto);
      reset({
        date: presupuesto.date.split('T')[0],
        tipo: presupuesto.tipo,
        categoría: presupuesto.categoría,
        subcategoría: presupuesto.subcategoría || '',
        item: presupuesto.item || '',
        monto: presupuesto.monto,
        descripción: presupuesto.descripción || '',
      });
    } else {
      setEditPresupuesto(null);
      reset({
        date: new Date().toISOString().split('T')[0],
        tipo: '',
        categoría: '',
        subcategoría: '',
        item: '',
        monto: 0,
        descripción: '',
      });
    }
    setOpenDialog(true);
  };

  // Función para cerrar el diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditPresupuesto(null);
    reset();
  };

  // Función para manejar la creación o actualización
  const onSubmit = async (data: FormData) => {
    try {
      if (editPresupuesto) {
        // Actualizar
        await axios.put(`/api/tabla_presupuesto/${editPresupuesto.id}`, data);
        setSnackbar({ open: true, message: 'Presupuesto actualizado exitosamente', severity: 'success' });
      } else {
        // Crear
        await axios.post('/api/tabla_presupuesto', data);
        setSnackbar({ open: true, message: 'Presupuesto creado exitosamente', severity: 'success' });
      }
      fetchPresupuestos();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al guardar el presupuesto', severity: 'error' });
    }
  };

  // Función para manejar la eliminación
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) return;

    try {
      await axios.delete(`/api/tabla_presupuesto/${id}`);
      setSnackbar({ open: true, message: 'Presupuesto eliminado exitosamente', severity: 'success' });
      fetchPresupuestos();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar el presupuesto', severity: 'error' });
    }
  };

  // Función para cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Base Presupuesto
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Agregar Presupuesto
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Subcategoría</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((presupuesto) => (
                <TableRow key={presupuesto.id}>
                  <TableCell>{presupuesto.id}</TableCell>
                  <TableCell>{new Date(presupuesto.date).toLocaleDateString('es-CL')}</TableCell>
                  <TableCell>{presupuesto.tipo}</TableCell>
                  <TableCell>{presupuesto.categoría}</TableCell>
                  <TableCell>{presupuesto.subcategoría || '-'}</TableCell>
                  <TableCell>{presupuesto.item || '-'}</TableCell>
                  <TableCell>
                    {presupuesto.monto.toLocaleString('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>{presupuesto.descripción || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(presupuesto)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(presupuesto.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {presupuestos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No hay presupuestos disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para crear/editar presupuesto */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editPresupuesto ? 'Editar Presupuesto' : 'Agregar Presupuesto'}</DialogTitle>
        <DialogContent>
          <form id="presupuesto-form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Controller
                name="tipo"
                control={control}
                rules={{ required: 'Tipo es requerido' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="tipo-label"
                    label="Tipo"
                    error={!!errors.tipo}
                  >
                    <MenuItem value="Ingresos">Ingresos</MenuItem>
                    <MenuItem value="Gastos">Gastos</MenuItem>
                    {/* Añade más opciones según tus necesidades */}
                  </Select>
                )}
              />
              {errors.tipo && (
                <Typography variant="caption" color="error">
                  {errors.tipo.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name="categoría"
              control={control}
              rules={{ required: 'Categoría es requerida' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Categoría"
                  fullWidth
                  margin="normal"
                  error={!!errors.categoría}
                  helperText={errors.categoría ? errors.categoría.message : ''}
                />
              )}
            />

            <Controller
              name="subcategoría"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subcategoría"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name="item"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Item"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name="monto"
              control={control}
              rules={{
                required: 'Monto es requerido',
                min: { value: 0, message: 'El monto debe ser positivo' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Monto"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.monto}
                  helperText={errors.monto ? errors.monto.message : ''}
                />
              )}
            />

            <Controller
              name="descripción"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Controller
              name="date"
              control={control}
              rules={{ required: 'Fecha es requerida' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.date}
                  helperText={errors.date ? errors.date.message : ''}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button type="submit" form="presupuesto-form" variant="contained" color="primary">
            {editPresupuesto ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BasePresupuesto;
