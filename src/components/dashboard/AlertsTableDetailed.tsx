// src/components/dashboard/AlertsTableDetailed.tsx

import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AlertEntry } from '../../types/alertEntry';

interface AlertsTableDetailedProps {
  alertEntries: AlertEntry[];
  formattedMonthYear: string;
  totalesPorTipo: any[]; // Ajustar el tipo según corresponda
}

const AlertsTableDetailed: React.FC<AlertsTableDetailedProps> = ({
  alertEntries,
  formattedMonthYear,
  totalesPorTipo,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Últimas Alertas Detalladas - {formattedMonthYear}
      </Typography>
      <TableContainer>
        <Table aria-label="tabla de alertas detalladas">
          <TableHead>
            <TableRow>
              <TableCell>Alerta</TableCell>
              <TableCell align="right">Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alertEntries.map((alert, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {alert.tipo}
                </TableCell>
                <TableCell align="right">{alert.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AlertsTableDetailed;
