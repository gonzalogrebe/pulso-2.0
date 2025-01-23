// src/app/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import ExpensesChart from '../components/dashboard/ExpensesChart';
import IncomeChart from '../components/dashboard/IncomeChart';
import SummaryTable from '../components/dashboard/SummaryTable';
import { Transaction } from '../types/transaction';
import { Presupuesto } from '../types/presupuesto';
import { TotalByTipo } from '../types/totalByTipo';
import { transformTransactions } from '../utils/totalbytipo';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UfValue } from '@prisma/client';

dayjs.extend(utc);



interface ChartData {
  labels: string[];
  expenses: {
    budget: number[];
    actual: number[];
  };
  incomes: {
    budget: number[];
    actual: number[];
  };
  comparison?: {
    labels: string[];
    expenses: {
      budget: number[];
      actual: number[];
    };
    incomes: {
      budget: number[];
      actual: number[];
    };
  };
}

/**
 * Formatea dos fechas en una cadena legible.
 * @param start - Fecha de inicio.
 * @param end - Fecha de fin.
 * @returns Cadena formateada como "Mes Año - Mes Año".
 */
function formattedMonthYear(start: Dayjs | null, end: Dayjs | null): string {
  if (start && end) {
    return `${start.format('MMMM YYYY')} - ${end.format('MMMM YYYY')}`;
  } else if (start) {
    return `${start.format('MMMM YYYY')}`;
  } else if (end) {
    return `${end.format('MMMM YYYY')}`;
  } else {
    return 'Periodo no definido';
  }
}

export default function Home() {
  // Estados para Transacciones y Presupuestos
  const [transactions, setTransactions] = React.useState<Transaction[] | null>(null);
  const [presupuestos, setPresupuestos] = React.useState<Presupuesto[] | null>(null);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(true);
  const [loadingPresupuestos, setLoadingPresupuestos] = React.useState<boolean>(true);
  const [errorTransactions, setErrorTransactions] = React.useState<string | null>(null);
  const [errorPresupuestos, setErrorPresupuestos] = React.useState<string | null>(null);


  // Estados para las fechas de los gráficos
  const [chartStartDate, setChartStartDate] = React.useState<Dayjs | null>(
    dayjs('2020-01-01') // Inicio en enero de 2020
  );
  const [chartEndDate, setChartEndDate] = React.useState<Dayjs | null>(
    dayjs('2020-12-31') // Fin en diciembre de 2020
  );

  // Estados para las fechas de la tabla
  const [tableStartDate, setTableStartDate] = React.useState<Dayjs | null>(
    dayjs('2020-01-01') // Inicio en enero de 2020
  );
  const [tableEndDate, setTableEndDate] = React.useState<Dayjs | null>(
    dayjs('2020-12-31') // Fin en diciembre de 2020
  );

  // Estados para ChartData
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [loadingChartData, setLoadingChartData] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Estado para Valores de UF
  const [ufValues, setUfValues] = React.useState<UfValue[]>([]);

  // Función para obtener datos desde la API
  const fetchChartData = async (start: Dayjs, end: Dayjs) => {
    try {
      setLoadingChartData(true);
      setError(null);

      let url = '/api/chart-data';

      // Formatear fechas en YYYY-MM-DD
      const formattedStart = start.format('YYYY-MM-DD');
      const formattedEnd = end.format('YYYY-MM-DD');

      // Añadir parámetros de consulta
      const params = new URLSearchParams();
      params.append('startDate', formattedStart);
      params.append('endDate', formattedEnd);

      url += `?${params.toString()}`;

      console.log('Solicitando datos desde:', url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar los datos del gráfico.');
      }

      const data: ChartData = await response.json();
      console.log('Datos obtenidos:', data);
      setChartData(data);
    } catch (err: any) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Error desconocido');
      setChartData(null);
    } finally {
      setLoadingChartData(false);
    }
  };

  // useEffect para fetch chart data cuando las fechas cambian
  React.useEffect(() => {
    if (chartStartDate && chartEndDate) {
      console.log(`Fetching chart data from ${chartStartDate.format()} to ${chartEndDate.format()}`);
      fetchChartData(chartStartDate, chartEndDate);
    }
  }, [chartStartDate, chartEndDate]);

  // Fetch Transacciones
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error(`Error al obtener transacciones: ${response.statusText}`);
        const data: Transaction[] = await response.json();
        setTransactions(data);
        console.log('Transacciones obtenidas:', data);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        setErrorTransactions(error.message || 'Error desconocido');
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  // Fetch Presupuestos
  React.useEffect(() => {
    const fetchPresupuestos = async () => {
      try {
        const response = await fetch('/api/presupuesto');
        if (!response.ok) throw new Error(`Error al obtener presupuestos: ${response.statusText}`);
        const data: Presupuesto[] = await response.json();
        setPresupuestos(data);
        console.log('Presupuestos obtenidos:', data);
      } catch (error: any) {
        console.error('Error fetching presupuestos:', error);
        setErrorPresupuestos(error.message || 'Error desconocido');
      } finally {
        setLoadingPresupuestos(false);
      }
    };

    fetchPresupuestos();
  }, []);

  // Fetch UF values
  const fetchUfValues = async () => {
    try {
      const res = await fetch('/api/uf');
      if (!res.ok) throw new Error('Error fetching UF values');
      const data: UfValue[] = await res.json();
      setUfValues(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUfValues();
  }, []);

  // Manejar estados de carga y error
  const isLoading = loadingTransactions || loadingPresupuestos || loadingChartData;
  const hasError = errorTransactions || errorPresupuestos || error;

  // Filtrar transacciones según las fechas de la tabla
  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      // Parsear la fecha de la transacción en UTC y ajustar al inicio del día
      const txDate = dayjs.utc(tx.date).startOf('day');

      // Convertir las fechas de la tabla a UTC y ajustar al inicio/final del día
      const startDateUTC = tableStartDate ? tableStartDate.utc().startOf('day') : null;
      const endDateUTC = tableEndDate ? tableEndDate.utc().endOf('day') : null;

      // Logs de depuración
      console.log(`Transaction date: ${txDate.format('YYYY-MM-DD')}`);
      console.log(`Start date UTC: ${startDateUTC?.format('YYYY-MM-DD')}`);
      console.log(`End date UTC: ${endDateUTC?.format('YYYY-MM-DD')}`);

      // Filtrar según el rango de fechas
      if (startDateUTC && txDate.isBefore(startDateUTC, 'day')) return false;
      if (endDateUTC && txDate.isAfter(endDateUTC, 'day')) return false;
      return true;
    });
  }, [transactions, tableStartDate, tableEndDate]);

  // Transformar las transacciones filtradas para SummaryTable
  const totalByTipo: TotalByTipo[] = React.useMemo(() => {
    return transformTransactions(filteredTransactions);
  }, [filteredTransactions]);

  // Logs de depuración
  React.useEffect(() => {
    console.log('Filtered Transactions:', filteredTransactions);
  }, [filteredTransactions]);

  React.useEffect(() => {
    console.log('Total By Tipo:', totalByTipo);
  }, [totalByTipo]);

  return (
    
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MUI.Box sx={{ maxWidth: '100%', overflow: 'hidden', p: 3 }}>
          <MUI.Typography
            variant="h4"
            component="h1"
            sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
          >
            Dashboard
          </MUI.Typography>

          <MUI.Grid container spacing={3}>
            {/* Gráficos */}
            <MUI.Grid item xs={12} md={6}>
              <ExpensesChart
                data={chartData?.expenses}
                labels={chartData?.labels}
                startDate={chartStartDate}
                endDate={chartEndDate}
              />
            </MUI.Grid>
            <MUI.Grid item xs={12} md={6}>
              <IncomeChart
                data={chartData?.incomes}
                labels={chartData?.labels}
                startDate={chartStartDate}
                endDate={chartEndDate}
              />
            </MUI.Grid>

            {/* Tabla de Resumen por Tipo y Categoría */}
            <MUI.Grid item xs={12}>
              {!isLoading && !hasError ? (
                <SummaryTable
                  totalByTipo={totalByTipo}
                  tableStartDate={tableStartDate}
                  tableEndDate={tableEndDate}
                  setTableStartDate={setTableStartDate}
                  setTableEndDate={setTableEndDate}
                  ufValues={ufValues} // Pasar los valores de UF
                />
              ) : isLoading ? (
                <MUI.CircularProgress />
              ) : (
                <MUI.Typography color="error">{hasError}</MUI.Typography>
              )}
            </MUI.Grid>
          </MUI.Grid>
        </MUI.Box>
      </LocalizationProvider>
    
  );
}
