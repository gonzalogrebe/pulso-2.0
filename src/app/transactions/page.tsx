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
import TransactionForm from './TransactionForm';

interface Transaction {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  glosa: string;
  t: string;             // Cambiado de T a t
  monto: number;
  numero_cta: string;
}

export default function TransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleEdit = (transaction: Transaction) => {
    console.log('Editando transacción:', transaction);
    if (!transaction?.id) {
      console.error('ID de transacción no válido');
      return;
    }
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedTransaction(null);
    setIsFormOpen(false);
  };

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Error al cargar las transacciones');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    return (
      (!filters.tipo || transaction.tipo === filters.tipo) &&
      (!filters.categoria || transaction.categoria.toLowerCase().includes(filters.categoria.toLowerCase())) &&
      (!filters.dateFrom || new Date(transaction.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(transaction.date) <= new Date(filters.dateTo))
    );
  });

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Movimientos Reales
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nueva Transacción
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Glosa</TableCell>
              <TableCell>T</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>NUMERO CTA</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                {/* Eliminados espacios y saltos de línea entre TableCell */}
                <TableCell>{new Date(transaction.date).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</TableCell><TableCell>{transaction.tipo}</TableCell><TableCell>{transaction.categoria}</TableCell><TableCell>{transaction.glosa || '-'}</TableCell><TableCell>{transaction.t || '-'}</TableCell><TableCell align="right" sx={{ color: transaction.tipo === 'Gastos' ? 'error.main' : 'success.main' }}>{transaction.tipo === 'Gastos' ? '-' : ''}{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(transaction.monto)}</TableCell><TableCell>{transaction.numero_cta || '-'}</TableCell><TableCell><IconButton size="small" onClick={() => handleEdit(transaction)} color="primary"><EditIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>

      <TransactionForm
        open={isFormOpen}
        onClose={handleClose}
        onTransactionAdded={fetchTransactions}
        isEditing={Boolean(selectedTransaction)}
        transactionId={selectedTransaction?.id}
      />
    </Box>
  );
}
