'use client';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

const alerts = [
  {
    id: 1,
    fecha: '2024-01-05',
    descripcion: 'Exceso de gastos en materiales',
    categoria: 'Materiales',
    variacion: '+15.2%',
    severidad: 'alta',
    monto: 28750
  },
  {
    id: 2,
    fecha: '2024-01-04',
    descripcion: 'Retraso en cronograma de obra',
    categoria: 'Cronograma',
    variacion: '5 días',
    severidad: 'media',
    monto: 0
  },
  {
    id: 3,
    fecha: '2024-01-03',
    descripcion: 'Desviación en costos de mano de obra',
    categoria: 'Mano de Obra',
    variacion: '+8.7%',
    severidad: 'baja',
    monto: 15660
  }
];

const getSeverityColor = (severidad: string) => {
  switch (severidad) {
    case 'alta':
      return 'error';
    case 'media':
      return 'warning';
    case 'baja':
      return 'info';
    default:
      return 'default';
  }
};

export default function AlertsTable() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Últimas Alertas
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Variación</TableCell>
              <TableCell>Severidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.fecha}</TableCell>
                <TableCell>{alert.descripcion}</TableCell>
                <TableCell>{alert.categoria}</TableCell>
                <TableCell align="right">
                  {alert.monto > 0 ? `$${alert.monto.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>{alert.variacion}</TableCell>
                <TableCell>
                  <Chip
                    label={alert.severidad.toUpperCase()}
                    color={getSeverityColor(alert.severidad) as any}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}