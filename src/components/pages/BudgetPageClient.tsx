// src/components/pages/BudgetPageClient.tsx
'use client';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import CategorySummary from '@/components/summary/CategorySummary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface MonthYear {
  month: number;
  year: number;
  label: string;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const years = [2023, 2024, 2025];

// Función helper para generar datos mensuales consistentes
const generateMonthlyData = (startYear: number) => {
  const data: { [key: string]: any } = {};

  for (let year = startYear - 1; year <= startYear + 1; year++) {
    for (let month = 0; month < 12; month++) {
      const key = `${year}-${month}`;
      data[key] = {
        expenses: {
          budget: 1000000,
          actual: 950000 + (month * 10000)
        },
        income: {
          budget: 1250000,
          actual: 1200000 + (month * 12000)
        }
      };
    }
  }

  return data;
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const initialMonthlyData = generateMonthlyData(currentYear);

export default function BudgetPageClient() {
  const [monthlyData] = useState(initialMonthlyData);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const generateMonthOptions = (): MonthYear[] => {
    const options: MonthYear[] = [];
    let month = currentMonth;
    let year = currentYear;

    for (let i = 0; i < 24; i++) {
      options.push({
        month,
        year,
        label: `${months[month]} ${year}`
      });

      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
    }

    return options;
  };

  const monthOptions = useMemo(() => generateMonthOptions(), []);

  const [selectedMonthYears, setSelectedMonthYears] = useState<MonthYear[]>(
    monthOptions.slice(0, 6)
  );

  const yearSummary = {
    expenses: {
      budget: 12000000,
      actual: 11500000
    },
    income: {
      budget: 15000000,
      actual: 14800000
    }
  };

  const handleMonthYearChange = (event: any) => {
    const value = event.target.value;
    setSelectedMonthYears(
      typeof value === 'string' ? JSON.parse(value) : value
    );
  };

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header section */}
      <Box sx={{
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="h1">
            Presupuesto
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            backgroundColor: 'background.paper',
            padding: '4px 12px',
            borderRadius: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <CalendarTodayIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1">
              {currentYear}
            </Typography>
          </Box>
        </Box>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as number)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Resumen Anual */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumen Anual {selectedYear}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CategorySummary
              title="Total Gastos Anuales"
              data={yearSummary.expenses}
              type="expense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CategorySummary
              title="Total Ingresos Anuales"
              data={yearSummary.income}
              type="income"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Sección Mensual */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6">Detalle Mensual</Typography>
          <FormControl sx={{ minWidth: 300 }}>
            <Select
              multiple
              value={selectedMonthYears}
              onChange={handleMonthYearChange}
              input={<OutlinedInput size="small" />}
              renderValue={(selected) => (
                selected.map(item => item.label).join(', ')
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  }
                }
              }}
            >
              {monthOptions.map((option) => (
                <MenuItem
                  key={`${option.month}-${option.year}`}
                  value={option}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <Checkbox
                    checked={selectedMonthYears.some(
                      item => item.month === option.month && item.year === option.year
                    )}
                  />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {selectedMonthYears
            .sort((a, b) => {
              if (b.year !== a.year) return b.year - a.year;
              return b.month - a.month;
            })
            .map((monthYear) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={`${monthYear.month}-${monthYear.year}`}
              >
                <Paper sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {monthYear.label}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Link href="/budget/expenses" style={{ textDecoration: 'none' }}>
                        <Paper sx={{
                          p: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <CategorySummary
                            title="Gastos"
                            data={monthlyData[`${monthYear.year}-${monthYear.month}`].expenses}
                            type="expense"
                          />
                        </Paper>
                      </Link>
                    </Grid>
                    <Grid item xs={12}>
                      <Link href="/budget/income" style={{ textDecoration: 'none' }}>
                        <Paper sx={{
                          p: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <CategorySummary
                            title="Ingresos"
                            data={monthlyData[`${monthYear.year}-${monthYear.month}`].income}
                            type="income"
                          />
                        </Paper>
                      </Link>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}