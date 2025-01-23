// src/components/dashboard/ItemsManager.tsx
'use client';
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  IconButton,
  Stack,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Item, ItemType } from '@/types/items';
import { dummyItems } from '@/data/dummyItems';

interface ItemsManagerProps {
  defaultFilter?: 'all' | ItemType;
  showTotalsOnly?: boolean;
  defaultCategory?: string;
}

const categories = [
  'Personal',
  'Materiales',
  'Equipamiento',
  'Ventas',
  'Alquileres',
  'Servicios',
  'Otros'
];

export default function ItemsManager({
  defaultFilter = 'all',
  showTotalsOnly = false,
  defaultCategory
}: ItemsManagerProps) {
  // Estado para los items con persistencia en localStorage
  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('items');
      if (savedItems) {
        return JSON.parse(savedItems);
      }
    }
    return dummyItems;
  });

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<'all' | ItemType>(defaultFilter);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [formData, setFormData] = useState<Partial<Item>>({
    type: defaultFilter === 'all' ? 'expense' : defaultFilter,
    name: '',
    amount: 0,
    category: defaultCategory || 'Otros',
    date: new Date().toISOString().split('T')[0]
  });

  // Función para actualizar items y guardar en localStorage
  const updateItems = (newItems: Item[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('items', JSON.stringify(newItems));
    }
  };

  const handleOpen = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        type: defaultFilter === 'all' ? 'expense' : defaultFilter,
        name: '',
        amount: 0,
        category: defaultCategory || 'Otros',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      type: defaultFilter === 'all' ? 'expense' : defaultFilter,
      name: '',
      amount: 0,
      category: defaultCategory || 'Otros',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.amount !== undefined) {
      if (editingItem) {
        const updatedItems = items.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        );
        updateItems(updatedItems);
      } else {
        const newItem: Item = {
          id: Date.now().toString(),
          name: formData.name,
          type: formData.type as ItemType,
          amount: formData.amount,
          date: formData.date || new Date().toISOString().split('T')[0],
          category: formData.category || defaultCategory || 'Otros'
        };
        updateItems([...items, newItem]);
      }
      handleClose();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ítem?')) {
      const updatedItems = items.filter(item => item.id !== id);
      updateItems(updatedItems);
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    if (filter !== 'all') {
      result = result.filter(item => item.type === filter);
    }

    if (defaultCategory) {
      result = result.filter(item => item.category === defaultCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      } else {
        return sortOrder === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });

    return result;
  }, [items, filter, sortBy, sortOrder, defaultCategory]);

  const totalIncome = useMemo(() =>
    items
      .filter(item => item.type === 'income' && (!defaultCategory || item.category === defaultCategory))
      .reduce((sum, item) => sum + item.amount, 0),
    [items, defaultCategory]
  );

  const totalExpenses = useMemo(() =>
    items
      .filter(item => item.type === 'expense' && (!defaultCategory || item.category === defaultCategory))
      .reduce((sum, item) => sum + item.amount, 0),
    [items, defaultCategory]
  );

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {defaultCategory || 'Ítems'} - {defaultFilter === 'all' ? 'Todos' : defaultFilter === 'income' ? 'Ingresos' : 'Gastos'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Agregar Ítem
            </Button>
          </Box>

          <Stack direction="row" spacing={2} mb={3}>
            <Chip
              label={`Total Ingresos: $${totalIncome.toLocaleString()}`}
              color="success"
            />
            <Chip
              label={`Total Gastos: $${totalExpenses.toLocaleString()}`}
              color="error"
            />
            <Chip
              label={`Balance: $${(totalIncome - totalExpenses).toLocaleString()}`}
              color={totalIncome - totalExpenses >= 0 ? 'success' : 'error'}
            />
          </Stack>

          {!showTotalsOnly && (
            <Grid container spacing={2}>
              {filteredAndSortedItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" component="div">
                            {item.name}
                          </Typography>
                          <Typography color={item.type === 'income' ? 'success.main' : 'error.main'}>
                            {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {item.date}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(item)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar Ítem' : 'Agregar Nuevo Ítem'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type}
              label="Tipo"
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ItemType })}
            >
              <MenuItem value="expense">Gasto</MenuItem>
              <MenuItem value="income">Ingreso</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="normal"
            label="Nombre"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Monto"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
          <TextField
            margin="normal"
            label="Fecha"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category}
              label="Categoría"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingItem ? 'Guardar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}