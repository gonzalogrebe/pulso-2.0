import React from "react";
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
} from "@mui/material";
import { green, red, grey } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TotalByTipo } from "../../types/totalByTipo";
import { UfValue } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import { getUfValue } from "../../utils/getUfValue";

interface SummaryTableProps {
  totalByTipo: TotalByTipo[];
  tableStartDate: Dayjs | null;
  tableEndDate: Dayjs | null;
  ufValues: UfValue[]; // Valores de UF para los cálculos
}

const SummaryTable: React.FC<SummaryTableProps> = ({
  totalByTipo,
  tableStartDate,
  tableEndDate,
  ufValues,
}) => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({});

  // Filtrar los datos por rango de fechas
  const filteredData = Array.isArray(totalByTipo)
  ? totalByTipo.filter((item) => {
      if (!tableStartDate || !tableEndDate) return true;
      const itemDate = dayjs(item.date); // Asegúrate de que la fecha sea válida
      return itemDate.isBetween(tableStartDate, tableEndDate, "day", "[]");
    })
  : [];


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

      {filteredData.length > 0 ? (
        <TableContainer>
          <Table stickyHeader aria-label="tabla resumen por tipo">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">UF</TableCell>
                <TableCell align="right">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => {
                const ufDate = dayjs(`${item.year}-${item.month}-01`);
                const ufValue = getUfValue(ufValues, ufDate);
                const rowKey = `${item.tipo}-${item.year}-${item.month}`;

                // Lógica del renderizado de filas
                return (
                  <TableRow key={rowKey}>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell align="right">
                      ${item.total.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell align="right">
                      {ufValue ? `$${ufValue.toFixed(2)}` : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No hay datos para mostrar en el resumen por tipo.</Typography>
      )}
    </Paper>
  );
};

export default SummaryTable;
