// src/components/dashboard/AlertsTableSimplified.tsx

import React from 'react';
import * as MUI from '@mui/material';

interface AlertsTableSimplifiedProps {
  realGastos: number;
  presupuestoGastos: number;
  realIngresos: number;
  presupuestoIngresos: number;
}

const AlertsTableSimplified: React.FC<AlertsTableSimplifiedProps> = ({
  realGastos,
  presupuestoGastos,
  realIngresos,
  presupuestoIngresos,
}) => {
  return (
    <MUI.Paper sx={{ p: 3 }}>
      <MUI.Typography variant="h5" sx={{ mb: 3 }}>
        Últimas Alertas
      </MUI.Typography>
      <MUI.TableContainer>
        <MUI.Table>
          <MUI.TableHead>
            <MUI.TableRow>
              <MUI.TableCell>Tipo</MUI.TableCell>
              <MUI.TableCell align="right">Real</MUI.TableCell>
              <MUI.TableCell align="right">Presupuesto</MUI.TableCell>
            </MUI.TableRow>
          </MUI.TableHead>
          <MUI.TableBody>
            <MUI.TableRow>
              <MUI.TableCell component="th" scope="row">
                Gastos
              </MUI.TableCell>
              <MUI.TableCell align="right">${realGastos.toLocaleString('es-CL')}</MUI.TableCell>
              <MUI.TableCell align="right">${presupuestoGastos.toLocaleString('es-CL')}</MUI.TableCell>
            </MUI.TableRow>
            <MUI.TableRow>
              <MUI.TableCell component="th" scope="row">
                Ingresos
              </MUI.TableCell>
              <MUI.TableCell align="right">${realIngresos.toLocaleString('es-CL')}</MUI.TableCell>
              <MUI.TableCell align="right">${presupuestoIngresos.toLocaleString('es-CL')}</MUI.TableCell>
            </MUI.TableRow>
          </MUI.TableBody>
        </MUI.Table>
      </MUI.TableContainer>
    </MUI.Paper>
  );
};

export default AlertsTableSimplified;
