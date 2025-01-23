'use client';
import * as MUI from '@mui/material';
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CategorySummary from '@/components/summary/CategorySummary';
import { CircularProgress } from '@mui/material';

// Definir las interfaces
interface Transaction {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  subcategoria?: string;
  item?: string;
  monto: number;
  descripcion?: string;
  provider_client?: string;
  payment_method?: string;
  reference?: string;
  created_at?: string;
  updated_at?: string;
}

interface Summary {
  total: {
    budget: number;
    actual: number;
  };
  categories: Record<string, { budget: number; actual: number }>;
}

// Constantes globales
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth(); // 0-11

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Columnas para el DataGrid sin acciones
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'date', headerName: 'Fecha', width: 130 },
  { field: 'categoria', headerName: 'Categoría', width: 200 },
  { field: 'descripcion', headerName: 'Descripción', width: 300 },
  {
    field: 'monto',
    headerName: 'Monto',
    width: 150,
    renderCell: (params) => (
      params.value.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
      })
    )
  }
];

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [yearSummary, setYearSummary] = useState<Summary | null>(null);
  const [monthSummary, setMonthSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // DataGrid usa 0-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Función para obtener todas las transacciones
  const fetchAllTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?page=1&pageSize=1000'); // Ajusta el pageSize según tus necesidades
      if (!response.ok) {
        throw new Error('Error al obtener todas las transacciones');
      }
      const data = await response.json();
      if (!data.transactions) {
        throw new Error('No se encontraron transacciones');
      }
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      // Aquí puedes mostrar una notificación de error al usuario
    }
  };

  // Función para calcular el resumen anual
  const calculateYearSummary = (transactions: Transaction[]) => {
    const currentYearTransactions = transactions.filter(tx => new Date(tx.date).getFullYear() === currentYear);
    const totalActual = currentYearTransactions.reduce((acc, tx) => acc + tx.monto, 0);
    const totalBudget = 12000000; // Puedes reemplazar esto con lógica para obtener el presupuesto anual real

    // Calcular por categorías
    const categories = currentYearTransactions.reduce((acc, tx) => {
      if (!acc[tx.categoria]) {
        acc[tx.categoria] = { budget: 0, actual: 0 };
      }
      acc[tx.categoria].actual += tx.monto;
      return acc;
    }, {} as Record<string, { budget: number; actual: number }>);

    // Asignar presupuestos por categoría
    // Puedes reemplazar estos valores con presupuestos reales si los tienes
    const categoryBudgets: Record<string, number> = {
      'Materiales': 6000000,
      'Mano de Obra': 4000000,
      'Otros': 2000000
    };

    Object.keys(categories).forEach(cat => {
      categories[cat].budget = categoryBudgets[cat] || 0;
    });

    setYearSummary({
      total: {
        budget: totalBudget,
        actual: totalActual
      },
      categories
    });
  };

  // Función para calcular el resumen mensual
  const calculateMonthSummary = (transactions: Transaction[]) => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const currentMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= firstDay && txDate <= lastDay;
    });

    const totalActual = currentMonthTransactions.reduce((acc, tx) => acc + tx.monto, 0);
    const totalBudget = 1000000; // Puedes reemplazar esto con lógica para obtener el presupuesto mensual real

    // Calcular por categorías
    const categories = currentMonthTransactions.reduce((acc, tx) => {
      if (!acc[tx.categoria]) {
        acc[tx.categoria] = { budget: 0, actual: 0 };
      }
      acc[tx.categoria].actual += tx.monto;
      return acc;
    }, {} as Record<string, { budget: number; actual: number }>);

    // Asignar presupuestos por categoría
    // Puedes reemplazar estos valores con presupuestos reales si los tienes
    const categoryBudgets: Record<string, number> = {
      'Materiales': 500000,
      'Mano de Obra': 300000,
      'Equipos': 200000,
      'Subcontratos': 400000,
      'Gastos generales': 100000
    };

    Object.keys(categories).forEach(cat => {
      categories[cat].budget = categoryBudgets[cat] || 0;
    });

    setMonthSummary({
      total: {
        budget: totalBudget,
        actual: totalActual
      },
      categories
    });
  };

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllTransactions();
      setLoading(false);
    };

    fetchData();
  }, []);

  // useEffect para calcular resúmenes cuando las transacciones cambian
  useEffect(() => {
    if (transactions.length > 0) {
      calculateYearSummary(transactions);
      calculateMonthSummary(transactions);
    } else {
      setYearSummary(null);
      setMonthSummary(null);
    }
  }, [transactions]);

  // Función para manejar paginación
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchTransactions(newPage, pageSize);
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
    await fetchTransactions(0, newPageSize);
  };

  // Función para obtener transacciones con paginación (si decides mantenerla)
  const fetchTransactions = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(`/api/transactions?page=${page + 1}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Error al obtener las transacciones');
      }
      const data = await response.json();
      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      // Aquí puedes mostrar una notificación de error al usuario
    }
  };

  // Preparar filas para el DataGrid
  const rows = transactions.map((transaction) => ({
    id: transaction.id,
    date: transaction.date.split('T')[0], // Formatear la fecha
    categoria: transaction.categoria,
    descripcion: transaction.descripcion || '',
    monto: transaction.monto,
  }));

  // Calcular totales para el mes actual
  const totalVariance = monthSummary ? monthSummary.total.actual - monthSummary.total.budget : 0;

  return (
    <MUI.Box sx={{ p: 3 }}>
      {/* Título */}
      <MUI.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <MUI.Typography variant="h4">Gastos</MUI.Typography>
      </MUI.Box>

      {/* 1. Resumen Anual */}
      <MUI.Paper sx={{ p: 3, mb: 4 }}>
        <MUI.Typography variant="h5" sx={{ mb: 3 }}>
          Resumen Anual {currentYear}
        </MUI.Typography>
        {yearSummary ? (
          <MUI.Grid container spacing={3}>
            <MUI.Grid item xs={12}>
              <CategorySummary
                title="Total Gastos"
                data={yearSummary.total}
                type="expense"
              />
            </MUI.Grid>
            {Object.entries(yearSummary.categories || {}).map(([categoria, data]) => (
              <MUI.Grid item xs={12} sm={6} md={4} key={categoria}>
                <CategorySummary
                  title={categoria}
                  data={data}
                  type="expense"
                />
              </MUI.Grid>
            ))}
          </MUI.Grid>
        ) : (
          <CircularProgress />
        )}
      </MUI.Paper>

      {/* 2. Resumen Mes Actual */}
      <MUI.Paper sx={{ p: 3, mb: 4 }}>
        <MUI.Typography variant="h5" sx={{ mb: 3 }}>
          Resumen Mes Actual ({months[currentMonth]} {currentYear})
        </MUI.Typography>
        {monthSummary ? (
          <MUI.Grid container spacing={3}>
            <MUI.Grid item xs={12}>
              <CategorySummary
                title="Total Gastos"
                data={monthSummary.total}
                type="expense"
              />
            </MUI.Grid>
            {Object.entries(monthSummary.categories || {}).map(([categoria, data]) => (
              <MUI.Grid item xs={12} sm={6} md={4} key={categoria}>
                <CategorySummary
                  title={categoria}
                  data={data}
                  type="expense"
                />
              </MUI.Grid>
            ))}
          </MUI.Grid>
        ) : (
          <CircularProgress />
        )}
      </MUI.Paper>

      {/* 3. Tabla de Resumen Mes Actual */}
      <MUI.Paper sx={{ p: 3, mb: 4 }}>
        <MUI.Typography variant="h5" sx={{ mb: 3 }}>
          Detalle Mes Actual ({months[currentMonth]} {currentYear})
        </MUI.Typography>
        {monthSummary ? (
          <MUI.TableContainer>
            <MUI.Table size="small">
              <MUI.TableHead>
                <MUI.TableRow>
                  <MUI.TableCell>Categoría</MUI.TableCell>
                  <MUI.TableCell align="right">Presupuestado</MUI.TableCell>
                  <MUI.TableCell align="right">Real</MUI.TableCell>
                  <MUI.TableCell align="right">Diferencia</MUI.TableCell>
                  <MUI.TableCell align="right">%</MUI.TableCell>
                </MUI.TableRow>
              </MUI.TableHead>
              <MUI.TableBody>
                {Object.entries(monthSummary.categories || {}).map(([categoria, data]) => {
                  const variance = data.actual - data.budget;
                  const percentage = data.budget !== 0 ? (variance / data.budget) * 100 : 0;

                  return (
                    <MUI.TableRow key={categoria} hover>
                      <MUI.TableCell>{categoria}</MUI.TableCell>
                      <MUI.TableCell align="right">
                        {data.budget.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </MUI.TableCell>
                      <MUI.TableCell align="right">
                        {data.actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </MUI.TableCell>
                      <MUI.TableCell align="right" sx={{ color: variance > 0 ? 'error.main' : 'success.main' }}>
                        {Math.abs(variance).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </MUI.TableCell>
                      <MUI.TableCell align="right" sx={{ color: variance > 0 ? 'error.main' : 'success.main' }}>
                        {percentage.toFixed(1)}%
                      </MUI.TableCell>
                    </MUI.TableRow>
                  );
                })}
              </MUI.TableBody>
            </MUI.Table>
          </MUI.TableContainer>
        ) : (
          <CircularProgress />
        )}
      </MUI.Paper>

      {/* DataGrid */}
      <MUI.Paper sx={{ p: 3 }}>
        <MUI.Typography variant="h5" sx={{ mb: 3 }}>
          Detalle de Movimientos
        </MUI.Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          page={page}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 25, 50]}
          rowCount={total}
          paginationMode="server"
          onPageChange={(newPage) => handlePageChange(newPage)}
          onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          loading={loading}
        />
      </MUI.Paper>
    </MUI.Box>
  );
}
