// src/components/dashboard/DashboardHeader.tsx
'use client';

import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es'; // Importar localización en español
import { useEffect } from 'react';

interface DashboardHeaderProps {
  startDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (date: Dayjs | null) => void;
  applyFilters: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applyFilters,
}) => {
  console.log('DashboardHeader Props:', { startDate, setStartDate, endDate, setEndDate, applyFilters });

  // Verificación adicional para asegurarse de que setStartDate y setEndDate son funciones
  useEffect(() => {
    if (typeof setStartDate !== 'function' || typeof setEndDate !== 'function') {
      console.error('setStartDate o setEndDate no son funciones:', { setStartDate, setEndDate });
    }
  }, [setStartDate, setEndDate]);

  const today = dayjs().locale('es').format('DD/MM/YYYY');

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Panel de Control
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Fecha actual: {today}
          </Typography>
        </Box>

        {/* Selectores de Fecha */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <DatePicker
              views={['year', 'month']}
              label="Fecha Desde"
              value={startDate}
              onChange={(newValue) => {
                console.log('Nueva Fecha Desde:', newValue);
                setStartDate(newValue);
                // Asegurar que endDate no es anterior a startDate
                if (endDate && newValue && newValue.isAfter(endDate)) {
                  setEndDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
              maxDate={endDate || dayjs()}
            />
            <DatePicker
              views={['year', 'month']}
              label="Fecha Hasta"
              value={endDate}
              onChange={(newValue) => {
                console.log('Nueva Fecha Hasta:', newValue);
                setEndDate(newValue);
                // Asegurar que startDate no es posterior a endDate
                if (startDate && newValue && newValue.isBefore(startDate)) {
                  setStartDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
              minDate={startDate || dayjs('1900-01-01')}
              maxDate={dayjs()}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={applyFilters}
                disabled={!startDate || !endDate}
              >
                Aplicar Filtros
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>
    </Paper>
  );
};

export default DashboardHeader;
