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

interface Transaction {
  id: string;
  date: string;
  tipo: string;
  categoria: string;
  glosa: string;
  t: string;
  monto: number;
  numero_cta: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit }: TransactionListProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Glosa</TableCell>
            <TableCell>T</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell>Número Cuenta</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.tipo}</TableCell>
              <TableCell>{transaction.categoria}</TableCell>
              <TableCell>{transaction.glosa}</TableCell>
              <TableCell>{transaction.t}</TableCell>
              <TableCell align="right">
                {transaction.monto.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'PEN'
                })}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(transaction)}>
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