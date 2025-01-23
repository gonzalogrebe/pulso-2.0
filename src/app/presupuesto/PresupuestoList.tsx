// src/app/presupuesto/PresupuestoList.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface Presupuesto {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  subcategoria?: string;
  item?: string;
  monto: number;
  descripcion?: string;
}

interface PresupuestoListProps {
  presupuestos: Presupuesto[];
  onEdit: (presupuesto: Presupuesto) => void;
}

export default function PresupuestoList({ presupuestos, onEdit }: PresupuestoListProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Subcategoría</TableCell>
            <TableCell>Ítem</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {presupuestos.map((presupuesto) => (
            <TableRow key={presupuesto.id}>
              <TableCell>{new Date(presupuesto.date).toLocaleDateString('es-CL')}</TableCell>
              <TableCell>{presupuesto.tipo}</TableCell>
              <TableCell>{presupuesto.categoria}</TableCell>
              <TableCell>{presupuesto.subcategoria || '-'}</TableCell>
              <TableCell>{presupuesto.item || '-'}</TableCell>
              <TableCell align="right">
                {presupuesto.monto.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP'
                })}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(presupuesto)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
