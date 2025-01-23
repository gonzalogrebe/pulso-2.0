// src/components/dashboard/SummaryTable.tsx

import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  TextField,
} from '@mui/material';
import { green, red, grey } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TotalByTipo } from '../../types/totalByTipo';
import { UfValue } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getUfValue } from '../../utils/getUfValue';

interface SummaryTableProps {
  totalByTipo: TotalByTipo[];
  tableStartDate: Dayjs | null;
  tableEndDate: Dayjs | null;
  setTableStartDate: (date: Dayjs | null) => void;
  setTableEndDate: (date: Dayjs | null) => void;
  ufValues: UfValue[]; // Valores de UF para los cálculos
}

const SummaryTable: React.FC<SummaryTableProps> = ({
  totalByTipo,
  tableStartDate,
  tableEndDate,
  setTableStartDate,
  setTableEndDate,
  ufValues,
}) => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({});

  // Manejar la expansión de filas
  const handleClick = (key: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Resumen por Tipo
      </Typography>

      {/* Selector de Fechas para la Tabla */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Fecha de Inicio"
            value={tableStartDate}
            onChange={(newValue) => setTableStartDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Fecha de Fin"
            value={tableEndDate}
            onChange={(newValue) => setTableEndDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
      </Grid>

      {totalByTipo.length > 0 ? (
        <TableContainer>
          <Table stickyHeader aria-label="tabla resumen por tipo">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">UF</TableCell> {/* Nueva columna */}
                <TableCell align="right">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {totalByTipo.map((item) => {
                let statusColor = grey[500];
                let statusText = 'Equilibrado';

                if (item.tipo === 'Gastos') {
                  statusColor = item.total > 1000000 ? red[500] : green[500];
                  statusText = item.total > 1000000 ? 'Gastos Excedidos' : 'Dentro del Presupuesto';
                } else if (item.tipo === 'Ingresos') {
                  statusColor = item.total > 2000000 ? green[500] : grey[500];
                  statusText = item.total > 2000000 ? 'Ingresos Superados' : 'Ingresos Insuficientes';
                }

                // Obtener el valor de UF correspondiente al año y mes
                const ufDate = dayjs(`${item.year}-${item.month}-01`);
                const ufValue = getUfValue(ufValues, ufDate);

                // Clave única para manejar la expansión de filas
                const rowKey = `${item.tipo}-${item.year}-${item.month}`;

                return (
                  <React.Fragment key={rowKey}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(rowKey)}
                          disabled={!Array.isArray(item.categorias) || item.categorias.length === 0}
                        >
                          {open[rowKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.tipo} - {item.month}/{item.year}
                      </TableCell>
                      <TableCell align="right">${item.total.toLocaleString('es-CL')}</TableCell>
                      <TableCell align="right">
                        {ufValue !== null ? (
                          `$${(item.total * ufValue).toLocaleString('es-CL')}`
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={statusColor}>{statusText}</Typography>
                      </TableCell>
                    </TableRow>
                    {open[rowKey] && Array.isArray(item.categorias) && item.categorias.length > 0 && (
                      <>
                        {item.categorias.map((categoria) => {
                          const categoriaUfValue = getUfValue(ufValues, ufDate);
                          return (
                            <TableRow key={`${rowKey}-${categoria.nombre}`}>
                              <TableCell sx={{ pl: 6 }} />
                              <TableCell>{categoria.nombre}</TableCell>
                              <TableCell align="right">${categoria.total.toLocaleString('es-CL')}</TableCell>
                              <TableCell align="right">
                                {categoriaUfValue !== null ? (
                                  `$${(categoria.total * categoriaUfValue).toLocaleString('es-CL')}`
                                ) : (
                                  'N/A'
                                )}
                              </TableCell>
                              <TableCell align="right"></TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No hay datos para mostrar el resumen por tipo.
        </Typography>
      )}
    </Paper>
  );
};

export default SummaryTable;
