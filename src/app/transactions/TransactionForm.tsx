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

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  isEditing?: boolean;
  transactionId?: string;
}

const TIPOS_TRANSACCION = ['Gastos', 'Ingresos'];

const JERARQUIA_CATEGORIAS = {
  'Ingresos': [
    'Abono Credito',
    'Aportes',
    'Aportes Capital P.',
    'Crédito banco',
    'Dev Aportes',
    'Reajuste e Intereses',
    'Seguro TRC y RC',
    'Ventas'
  ],
  'Gastos': [
    'Administración Proyecto',
    'Banco',
    'Compra Terreno',
    'Construcción',
    'Empalmes',
    'Fotoc, planos, cont., imprev.',
    'Inspección técnica',
    'INT Cap Preferente',
    'Legales',
    'Permisos',
    'Postventa',
    'Proyectos',
    'Pub. Y Piloto',
    'Tanner',
    'Ventas'
  ]
} as const;

export default function TransactionForm({
  open,
  onClose,
  onTransactionAdded,
  isEditing = false,
  transactionId
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tipo: '',
    categoria: '',
    glosa: '',
    t: '',
    monto: '',
    numero_cta: '',
  });

  useEffect(() => {
    if (isEditing && transactionId) {
      const fetchTransactionData = async () => {
        try {
          console.log('Fetching transaction:', transactionId);

          const response = await fetch(`/api/transactions/${transactionId}`);

          console.log('Response status:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Transaction data received:', data);

          if (!data || data.error) {
            throw new Error(data?.error || 'No se encontró la transacción');
          }

          setFormData({
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            tipo: data.tipo || '',
            categoria: data.categoria || '',
            glosa: data.glosa || '',
            t: data.t || '',
            monto: data.monto ? data.monto.toString() : '',
            numero_cta: data.numero_cta ? data.numero_cta.toString() : '',
          });
        } catch (error) {
          console.error('Error completo al cargar la transacción:', error);
          alert('Error al cargar los datos de la transacción');
          onClose();
        }
      };

      fetchTransactionData();
    } else {
      // Reset form cuando no estamos editando
      setFormData({
        date: new Date().toISOString().split('T')[0],
        tipo: '',
        categoria: '',
        glosa: '',
        t: '',
        monto: '',
        numero_cta: '',
      });
    }
  }, [isEditing, transactionId, onClose]);

  const getAvailableCategories = () => {
    const currentTipo = formData.tipo;
    if (!currentTipo || !JERARQUIA_CATEGORIAS[currentTipo]) {
      return []; // Retorna un array vacío si el tipo no está definido o no tiene categorías.
    }
    return JERARQUIA_CATEGORIAS[currentTipo];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/transactions/${transactionId}` : '/api/transactions';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        monto: parseFloat(formData.monto),
        date: new Date(formData.date).toISOString(),
        numero_cta: formData.numero_cta ? parseFloat(formData.numero_cta) : null,
        // No hay subcategoría que manejar
      };

      console.log('Datos enviados:', payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', response.status, result);

      if (!response.ok) {
        throw new Error(`Error al guardar la transacción: ${response.status}`);
      }

      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar la transacción:', error);
      alert('Error al guardar la transacción. Por favor intente nuevamente.');
    }
  };

  const handleDelete = async () => {
    if (!transactionId) return;

    if (window.confirm('¿Está seguro que desea eliminar esta transacción?')) {
      try {
        const response = await fetch(`/api/transactions/${transactionId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la transacción');
        }

        onTransactionAdded(); // Asegúrate de que esta línea esté presente
        onClose();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Error al eliminar la transacción. Por favor intente nuevamente.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Fecha */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={formData.tipo}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    tipo: e.target.value,
                    categoria: '',
                  }));
                }}
                required
              >
                <MenuItem value="">Seleccione un tipo</MenuItem>
                {TIPOS_TRANSACCION.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Categoría */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Categoría"
                value={formData.categoria}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    categoria: e.target.value,
                  }));
                }}
                required
                disabled={!formData.tipo}
              >
                <MenuItem value="">Seleccione una categoría</MenuItem>
                {getAvailableCategories().map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Glosa */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Glosa"
                value={formData.glosa}
                onChange={(e) => setFormData(prev => ({ ...prev, glosa: e.target.value }))}
                required
              />
            </Grid>

            {/* T: Selección entre "E" e "I" */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="T"
                value={formData.t}
                onChange={(e) => setFormData(prev => ({ ...prev, t: e.target.value }))}
                required
              >
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="I">I</MenuItem>
              </TextField>
            </Grid>

            {/* Monto */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Monto"
                value={formData.monto}
                onChange={(e) => setFormData(prev => ({ ...prev, monto: e.target.value }))}
                required
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>

            {/* Número Cuenta */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número Cuenta"
                value={formData.numero_cta}
                onChange={(e) => setFormData(prev => ({ ...prev, numero_cta: e.target.value }))}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {isEditing && (
            <Button
              onClick={handleDelete}
              color="error"
              sx={{ marginRight: 'auto' }}
            >
              Eliminar
            </Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
