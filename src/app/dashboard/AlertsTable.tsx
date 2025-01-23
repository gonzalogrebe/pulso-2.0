// src/components/dashboard/AlertsTable.tsx

import * as React from 'react';
import * as MUI from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Alert as AlertType } from '@/types/alert'; // Importa la interfaz Alert

interface AlertsTableProps {
  alerts: AlertType[]; // Usa la interfaz importada
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <MUI.Paper sx={{ p: 3 }}>
      <MUI.Typography variant="h5" sx={{ mb: 3 }}>
        Últimas Alertas
      </MUI.Typography>
      {alerts.length === 0 ? (
        <MUI.Typography variant="body1">No hay alertas para mostrar.</MUI.Typography>
      ) : (
        <MUI.TableContainer>
          <MUI.Table>
            <MUI.TableHead>
              <MUI.TableRow>
                <MUI.TableCell>Fecha</MUI.TableCell>
                <MUI.TableCell>Tipo</MUI.TableCell>
                <MUI.TableCell>Categoría</MUI.TableCell>
                <MUI.TableCell>Diferencia (%)</MUI.TableCell>
                <MUI.TableCell>Mensaje</MUI.TableCell>
              </MUI.TableRow>
            </MUI.TableHead>
            <MUI.TableBody>
              {alerts.map((alert) => (
                <MUI.TableRow key={alert.id}>
                  <MUI.TableCell>
                    {new Date(alert.fecha).toLocaleDateString('es-CL', {
                      timeZone: 'UTC',
                    })}
                  </MUI.TableCell>
                  <MUI.TableCell>
                    <MuiAlert
                      severity={alert.tipo === 'Gastos' ? 'error' : 'success'}
                      variant="filled"
                      sx={{ width: 'fit-content' }}
                    >
                      {alert.tipo}
                    </MuiAlert>
                  </MUI.TableCell>
                  <MUI.TableCell>{alert.categoria}</MUI.TableCell>
                  <MUI.TableCell>
                    {alert.diferencia.toFixed(2)}%
                  </MUI.TableCell>
                  <MUI.TableCell>{alert.mensaje}</MUI.TableCell>
                </MUI.TableRow>
              ))}
            </MUI.TableBody>
          </MUI.Table>
        </MUI.TableContainer>
      )}
    </MUI.Paper>
  );
}
