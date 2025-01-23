// app/admin/uf/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { UfValue } from '@prisma/client';

interface FormState {
  year: number;
  month: number;
  value: number;
}

const UfManagementPage: React.FC = () => {
  const [ufValues, setUfValues] = useState<UfValue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ year: 2020, month: 1, value: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch UF values
  const fetchUfValues = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/uf');
      if (!res.ok) throw new Error('Error fetching UF values');
      const data: UfValue[] = await res.json();
      setUfValues(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching UF values');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUfValues();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (form.month < 1 || form.month > 12) {
      setSnackbar({ open: true, message: 'El mes debe estar entre 1 y 12.', severity: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/uf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error saving UF value');
      }

      const savedUf: UfValue = await res.json();

      setSnackbar({ open: true, message: 'Valor de UF guardado correctamente.', severity: 'success' });

      // Actualizar la lista de UF
      fetchUfValues();

      // Resetear el formulario
      setForm({ year: 2020, month: 1, value: 0 });
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || 'Error saving UF value.', severity: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este valor de UF?')) return;

    try {
      const res = await fetch(`/api/uf/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error deleting UF value');
      }

      setSnackbar({ open: true, message: 'Valor de UF eliminado correctamente.', severity: 'success' });

      // Actualizar la lista de UF
      fetchUfValues();
    } catch (err: any) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || 'Error deleting UF value.', severity: 'error' });
    }
  };

  // Handle edit
  const handleEdit = (uf: UfValue) => {
    setForm({ year: uf.year, month: uf.month, value: uf.value });
    setEditingId(uf.id);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Valores UF
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Año"
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value), })}
                required
                fullWidth
                inputProps={{ min: 1900, max: 2100 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Mes"
                type="number"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: parseInt(e.target.value), })}
                required
                fullWidth
                inputProps={{ min: 1, max: 12 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Valor UF"
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                required
                fullWidth
                inputProps={{ step: 0.0001 }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editingId ? 'Actualizar' : 'Agregar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Año</TableCell>
                  <TableCell>Mes</TableCell>
                  <TableCell>Valor UF</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ufValues.map((uf) => (
                  <TableRow key={uf.id}>
                    <TableCell>{uf.year}</TableCell>
                    <TableCell>{uf.month}</TableCell>
                    <TableCell>{uf.value.toLocaleString('es-CL')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(uf)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(uf.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UfManagementPage;
