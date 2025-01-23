import React, { useState } from "react";
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
  Collapse,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import dayjs, { Dayjs } from "dayjs";

interface Transaction {
  id: string;
  date: Dayjs;
  tipo: string;
  categoria: string;
  monto: number;
}

interface SummaryTableProps {
  transactions: Transaction[];
  tableStartDate: Dayjs | null;
  tableEndDate: Dayjs | null;
}

const SummaryTable: React.FC<SummaryTableProps> = ({
  transactions,
  tableStartDate,
  tableEndDate,
}) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  // Filtrar las transacciones por rango de fechas
  const filteredTransactions = transactions.filter((transaction) => {
    if (!tableStartDate || !tableEndDate) return true;
    return transaction.date.isBetween(tableStartDate, tableEndDate, "day", "[]");
  });

  // Obtener los meses únicos en el rango seleccionado, en orden ascendente
  const uniqueMonths = Array.from(
    new Set(
      filteredTransactions
        .map((transaction) => transaction.date.format("MMMM YYYY"))
        .sort((a, b) => dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY")))
    )
  );

  // Agrupar por tipo, luego por categoría y luego por mes
  const groupedByTipo = filteredTransactions.reduce((acc, transaction) => {
    const month = transaction.date.format("MMMM YYYY");
    if (!acc[transaction.tipo]) {
      acc[transaction.tipo] = { totalPorMes: {}, categorias: {} };
    }
    if (!acc[transaction.tipo].totalPorMes[month]) {
      acc[transaction.tipo].totalPorMes[month] = 0;
    }
    if (!acc[transaction.tipo].categorias[transaction.categoria]) {
      acc[transaction.tipo].categorias[transaction.categoria] = {};
    }
    if (!acc[transaction.tipo].categorias[transaction.categoria][month]) {
      acc[transaction.tipo].categorias[transaction.categoria][month] = 0;
    }

    acc[transaction.tipo].totalPorMes[month] += transaction.monto;
    acc[transaction.tipo].categorias[transaction.categoria][month] += transaction.monto;

    return acc;
  }, {} as Record<string, { totalPorMes: Record<string, number>; categorias: Record<string, Record<string, number>> }>);

  const toggleCollapse = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Resumen de Transacciones por Mes
      </Typography>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  width: "250px", // Ancho fijo uniforme
                  borderRight: "1px solid #ccc",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: 2,
                }}
              >
                Descripción
              </TableCell>
              {uniqueMonths.map((month) => (
                <TableCell key={month} align="right">
                  {month}
                </TableCell>
              ))}
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedByTipo).map(([tipo, { totalPorMes, categorias }]) => {
              const totalPorTipo = Object.values(totalPorMes).reduce(
                (sum, monto) => sum + monto,
                0
              );

              return (
                <React.Fragment key={tipo}>
                  {/* Fila principal (tipo) */}
                  <TableRow
                    sx={{
                      backgroundColor: "#f5f5f5",
                      "& > *": { fontWeight: "bold" },
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        width: "250px",
                        borderRight: "1px solid #ccc",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingLeft: 2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => toggleCollapse(tipo)}
                        sx={{ marginRight: 1 }}
                      >
                        {open[tipo] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                      {tipo}
                    </TableCell>
                    {uniqueMonths.map((month) => (
                      <TableCell key={`${tipo}-${month}`} align="right">
                        ${totalPorMes[month]?.toLocaleString("es-CL") || 0}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      ${totalPorTipo.toLocaleString("es-CL")}
                    </TableCell>
                  </TableRow>
                  {/* Filas de categorías */}
                  {open[tipo] &&
                    Object.entries(categorias).map(([categoria, montosPorMes]) => {
                      const totalPorCategoria = Object.values(montosPorMes).reduce(
                        (sum, monto) => sum + monto,
                        0
                      );

                      return (
                        <TableRow key={`${tipo}-${categoria}`}>
                          <Tooltip title={categoria} arrow>
                            <TableCell
                              align="left"
                              sx={{
                                width: "250px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                borderRight: "1px solid #ccc",
                                paddingLeft: 4,
                              }}
                            >
                              {categoria}
                            </TableCell>
                          </Tooltip>
                          {uniqueMonths.map((month) => (
                            <TableCell
                              key={`${categoria}-${month}`}
                              align="right"
                            >
                              ${montosPorMes[month]?.toLocaleString("es-CL") || 0}
                            </TableCell>
                          ))}
                          <TableCell align="right">
                            ${totalPorCategoria.toLocaleString("es-CL")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SummaryTable;
