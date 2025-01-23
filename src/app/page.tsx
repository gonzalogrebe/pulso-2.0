"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as MUI from "@mui/material";
import ExpensesChart from "../components/dashboard/ExpensesChart";
import IncomeChart from "../components/dashboard/IncomeChart";
import SummaryTable from "../components/dashboard/SummaryTable";
import { Transaction } from "../types/transaction";
import { TotalByTipo } from "../types/totalByTipo";
import { transformTransactions } from "../utils/totalbytipo";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UfValue } from "@prisma/client";

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
}

export default function Home() {
  // Estados para Transacciones
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);

  // Estados para Fechas
  const [tableStartDate, setTableStartDate] = useState<Dayjs | null>(dayjs("2020-01-01"));
  const [tableEndDate, setTableEndDate] = useState<Dayjs | null>(dayjs("2020-12-31"));

  // Estados para Gráficos
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loadingChartData, setLoadingChartData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para Valores de UF
  const [ufValues, setUfValues] = useState<UfValue[]>([]);

  // Función para obtener datos desde la API
  const fetchChartData = async (start: Dayjs, end: Dayjs) => {
    try {
      setLoadingChartData(true);
      setError(null);

      const url = `/api/chart-data?startDate=${start.format("YYYY-MM-DD")}&endDate=${end.format("YYYY-MM-DD")}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar los datos del gráfico.");
      }

      const data: ChartData = await response.json();
      setChartData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoadingChartData(false);
    }
  };

  // Cargar datos de transacciones
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) throw new Error("Error al obtener transacciones.");
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorTransactions(err.message);
        } else {
          setErrorTransactions("Error desconocido");
        }
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  // Cargar valores de UF
  useEffect(() => {
    const fetchUfValues = async () => {
      try {
        const response = await fetch("/api/uf");
        if (!response.ok) throw new Error("Error al obtener valores de UF.");
        const data: UfValue[] = await response.json();
        setUfValues(data);
      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchUfValues();
  }, []);

  // Filtrar transacciones por rango de fechas
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      const txDate = dayjs.utc(tx.date).startOf("day");
      const startDateUTC = tableStartDate ? tableStartDate.utc().startOf("day") : null;
      const endDateUTC = tableEndDate ? tableEndDate.utc().endOf("day") : null;

      if (startDateUTC && txDate.isBefore(startDateUTC, "day")) return false;
      if (endDateUTC && txDate.isAfter(endDateUTC, "day")) return false;
      return true;
    });
  }, [transactions, tableStartDate, tableEndDate]);

  // Transformar datos para la tabla resumen
  const totalByTipo: TotalByTipo[] = useMemo(() => transformTransactions(filteredTransactions), [filteredTransactions]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUI.Box sx={{ maxWidth: "100%", overflow: "hidden", p: 3 }}>
        <MUI.Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Dashboard
        </MUI.Typography>

        <MUI.Grid container spacing={3}>
          <MUI.Grid item xs={12} md={6}>
            <ExpensesChart data={chartData?.expenses} labels={chartData?.labels} />
          </MUI.Grid>
          <MUI.Grid item xs={12} md={6}>
            <IncomeChart data={chartData?.incomes} labels={chartData?.labels} />
          </MUI.Grid>

          <MUI.Grid item xs={12}>
            {loadingTransactions || loadingChartData ? (
              <MUI.CircularProgress />
            ) : (
              <SummaryTable
                totalByTipo={totalByTipo}
                tableStartDate={tableStartDate}
                tableEndDate={tableEndDate}
                setTableStartDate={setTableStartDate}
                setTableEndDate={setTableEndDate}
                ufValues={ufValues}
              />
            )}
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Box>
    </LocalizationProvider>
  );
}
