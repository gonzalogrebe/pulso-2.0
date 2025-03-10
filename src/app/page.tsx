"use client";

import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExpensesChart from "../components/dashboard/ExpensesChart";
import IncomeChart from "../components/dashboard/IncomeChart";
import SummaryTable from "../components/dashboard/SummaryTable";
import dayjs, { Dayjs } from "dayjs";

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

interface UfValue {
  date: string;
  value: number;
}

interface Transaction {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  monto: number;
}

export default function Home() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2019-08-01"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs("2020-02-28"));
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [ufValues, setUfValues] = useState<UfValue[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Función para obtener datos del gráfico
  const fetchChartData = async (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (!startDate || !endDate) return;

    const formattedStart = startDate.format("YYYY-MM-DD");
    const formattedEnd = endDate.format("YYYY-MM-DD");

    try {
      const response = await fetch(`/api/chart-data?startDate=${formattedStart}&endDate=${formattedEnd}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar los datos del gráfico.");
      }

      setChartData(data);
    } catch (error) {
      console.error("Error al obtener los datos del gráfico:", error);
    }
  };

  // Función para obtener transacciones
  const fetchTransactions = async (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (!startDate || !endDate) return;

    const formattedStart = startDate.format("YYYY-MM-DD");
    const formattedEnd = endDate.format("YYYY-MM-DD");

    try {
      const response = await fetch(`/api/transactions?startDate=${formattedStart}&endDate=${formattedEnd}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar las transacciones.");
      }

      setTransactions(
        data.map((transaction: any) => ({
          ...transaction,
          date: dayjs(transaction.date), // Normaliza la fecha a Dayjs
        }))
      );
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
    }
  };

  // Función para obtener valores de UF
  const fetchUfValues = async () => {
    try {
      const response = await fetch("/api/uf");
      const data = await response.json();
      setUfValues(data);
    } catch (error) {
      console.error("Error al obtener los valores de UF:", error);
    }
  };

  // Actualizar datos cuando cambien las fechas
  useEffect(() => {
    fetchChartData(startDate, endDate);
    fetchTransactions(startDate, endDate);
  }, [startDate, endDate]);

  // Obtener valores de UF al montar el componente
  useEffect(() => {
    fetchUfValues();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUI.Box sx={{ maxWidth: "100%", p: 3 }}>
        <MUI.Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Dashboard
        </MUI.Typography>

        {/* Selectores de Fecha */}
        <MUI.Grid container spacing={2} sx={{ mb: 3 }}>
          <MUI.Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              renderInput={(params) => <MUI.TextField {...params} fullWidth />}
            />
          </MUI.Grid>
          <MUI.Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              renderInput={(params) => <MUI.TextField {...params} fullWidth />}
            />
          </MUI.Grid>
        </MUI.Grid>

        {/* Gráficos */}
        <MUI.Grid container spacing={3}>
          <MUI.Grid item xs={12} md={6}>
            <ExpensesChart
              data={chartData?.expenses || { budget: [], actual: [] }}
              labels={chartData?.labels || []}
            />
          </MUI.Grid>
          <MUI.Grid item xs={12} md={6}>
            <IncomeChart
              data={chartData?.incomes || { budget: [], actual: [] }}
              labels={chartData?.labels || []}
            />
          </MUI.Grid>

          {/* Tabla */}
          <MUI.Grid item xs={12}>
            {transactions.length > 0 ? (
              <SummaryTable
                transactions={transactions}
                tableStartDate={startDate}
                tableEndDate={endDate}
              />
            ) : (
              <MUI.Typography variant="body1" color="textSecondary">
                No hay transacciones para mostrar.
              </MUI.Typography>
            )}
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Box>
    </LocalizationProvider>
  );
}
