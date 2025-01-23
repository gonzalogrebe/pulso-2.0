'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem
} from '@mui/material';

interface PresupuestoFormProps {
  open: boolean;
  onClose: () => void;
  onPresupuestoAdded: () => void;
  isEditing?: boolean;
  presupuestoId?: string;
}

const TIPOS_PRESUPUESTO = ['Gastos', 'Ingresos'];

const JERARQUIA_CATEGORIAS = {
  'Gastos': {
    'Materiales': ['Cemento', 'Arena', 'Piedra'],
    'Servicios': ['Consultoría', 'Mano de Obra'],
  },
  'Ingresos': {
    'Ventas': ['Producto A', 'Producto B'],
    'Otros': ['Donaciones', 'Subvenciones']
  }
} as const;

export default function PresupuestoForm({
  open,
  onClose,
  onPresupuestoAdded,
  isEditing = false,
  presupuestoId
}: PresupuestoFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tipo: '',
    categoria: '',
    subcategoria: '',
    item: '',
    monto: '',
    descripcion: ''
  });

  useEffect(() => {
    if (isEditing && presupuestoId) {
      const fetchPresupuestoData = async () => {
        try {
          const response = await fetch(`/api/presupuesto/${presupuestoId}`);
          if (!response.ok) throw new Error('Error al cargar el presupuesto');
          const data = await response.json();
          setFormData({
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
            tipo: data.tipo || '',
            categoria: data.categoria || '',
            subcategoria: data.subcategoria || '',
            item: data.item || '',
            monto: data.monto ? data.monto.toString() : '',
            descripcion: data.descripcion || ''
          });
        } catch (error) {
          console.error('Error al cargar los datos del presupuesto:', error);
          alert('Error al cargar los datos del presupuesto. Por favor, inténtelo de nuevo.');
          onClose();
        }
      };
      fetchPresupuestoData();
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        tipo: '',
        categoria: '',
        subcategoria: '',
        item: '',
        monto: '',
        descripcion: ''
      });
    }
  }, [isEditing, presupuestoId, onClose]);

  const getAvailableCategories = () => {
    const currentTipo = formData.tipo;
    return currentTipo ? Object.keys(JERARQUIA_CATEGORIAS[currentTipo as keyof typeof JERARQUIA_CATEGORIAS]) : [];
  };

  const getAvailableSubcategories = () => {
    const { tipo, categoria } = formData;
    if (!tipo || !categoria) return [];
    return JERARQUIA_CATEGORIAS[tipo as keyof typeof JERARQUIA_CATEGORIAS][categoria] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/presupuesto/${presupuestoId}` : '/api/presupuesto';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monto: parseFloat(formData.monto),
          date: new Date(formData.date).toISOString()
        })
      });

      if (!response.ok) throw new Error('Error al guardar el presupuesto');

      onPresupuestoAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar el presupuesto:', error);
      alert('Error al guardar el presupuesto. Por favor, inténtelo de nuevo.');
    }
  };

  const handleDelete = async () => {
    if (!presupuestoId) return;

    if (window.confirm('¿Está seguro que desea eliminar este presupuesto?')) {
      try {
        const response = await fetch(`/api/presupuesto/${presupuestoId}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el presupuesto');

        onPresupuestoAdded();
        onClose();
      } catch (error) {
        console.error('Error al eliminar el presupuesto:', error);
        alert('Error al eliminar el presupuesto. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value, categoria: '', subcategoria: '' })}
                required
              >
                <MenuItem value="">Seleccione un tipo</MenuItem>
                {TIPOS_PRESUPUESTO.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Categoría"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value, subcategoria: '' })}
                required
                disabled={!formData.tipo}
              >
                <MenuItem value="">Seleccione una categoría</MenuItem>
                {getAvailableCategories().map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Subcategoría"
                value={formData.subcategoria}
                onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                disabled={!formData.categoria}
              >
                <MenuItem value="">Seleccione una subcategoría</MenuItem>
                {getAvailableSubcategories().map(sub => (
                  <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ítem"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Monto"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {isEditing && (
            <Button onClick={handleDelete} color="error">Eliminar</Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
