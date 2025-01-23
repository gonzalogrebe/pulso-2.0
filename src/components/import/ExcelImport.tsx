// src/components/import/ExcelImport.tsx
'use client';
import { useState } from 'react';
import { Button, Box, Alert, Snackbar } from '@mui/material';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onDataImported: (data: any[]) => void;
}

interface ValidationError {
  row: number;
  errors: string[];
}

interface ExcelRow {
  categoria: string;
  descripcion: string;
  monto: string | number;
  fecha: string | number;
  [key: string]: any;
}

interface AlertState {
  message: string;
  severity: 'success' | 'error';
  open: boolean;
}

export default function ExcelImport({ onDataImported }: ExcelImportProps) {
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    severity: 'success',
    open: false
  });

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({
      message,
      severity,
      open: true
    });
  };

  const validateRow = (row: ExcelRow, rowIndex: number): string[] => {
    const errors: string[] = [];

    // Validar campos requeridos
    if (!row.categoria) errors.push('Categoría es requerida');
    if (!row.descripcion) errors.push('Descripción es requerida');
    if (!row.monto) errors.push('Monto es requerido');
    if (!row.fecha) errors.push('Fecha es requerida');

    // Validar formato de monto
    const amount = parseFloat(row.monto.toString().replace(',', '.'));
    if (isNaN(amount)) errors.push('Monto debe ser un número válido');
    if (amount <= 0) errors.push('Monto debe ser mayor que 0');

    // Validar fecha
    if (row.fecha) {
      let dateValue: Date | null = null;

      if (typeof row.fecha === 'number') {
        // Convertir número de Excel a fecha
        dateValue = new Date((row.fecha - 25569) * 86400 * 1000);
      } else {
        // Intentar parsear la fecha si es string
        const parts = row.fecha.toString().split(/[/-]/);
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          dateValue = new Date(year, month, day);
        }
      }

      // Validar que la fecha sea válida
      if (!dateValue || isNaN(dateValue.getTime())) {
        errors.push('Fecha no válida');
      }
    }

    // Validar categoría
    if (row.categoria && typeof row.categoria !== 'string') {
      errors.push('Categoría debe ser texto');
    }

    // Validar descripción
    if (row.descripcion && typeof row.descripcion !== 'string') {
      errors.push('Descripción debe ser texto');
    }

    return errors;
  };

  const validateExcelData = (data: ExcelRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validar que haya datos
    if (!data || data.length === 0) {
      showAlert('El archivo está vacío', 'error');
      return errors;
    }

    // Validar estructura de columnas
    const requiredColumns = ['categoria', 'descripcion', 'monto', 'fecha'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col =>
      !Object.keys(firstRow).map(key => key.toLowerCase()).includes(col)
    );

    if (missingColumns.length > 0) {
      showAlert(`Faltan columnas requeridas: ${missingColumns.join(', ')}`, 'error');
      return errors;
    }

    // Validar cada fila
    data.forEach((row, index) => {
      const rowErrors = validateRow(row, index);
      if (rowErrors.length > 0) {
        errors.push({
          row: index + 1,
          errors: rowErrors
        });
      }
    });

    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      showAlert('Formato de archivo no válido. Use .xlsx o .xls', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          dateNF: 'd/m/yyyy'
        });

        console.log('Datos leídos del Excel:', jsonData);

        // Validar los datos
        const validationErrors = validateExcelData(jsonData as ExcelRow[]);

        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.map(err =>
            `Fila ${err.row}: ${err.errors.join(', ')}`
          ).join('\n');
          showAlert(`Errores en los datos:\n${errorMessage}`, 'error');
          return;
        }

        // Procesar los datos
        const processedData = (jsonData as ExcelRow[]).map(row => {
          let dateValue: Date;

          if (typeof row.fecha === 'number') {
            dateValue = new Date((row.fecha - 25569) * 86400 * 1000);
          } else {
            const parts = row.fecha.toString().split(/[/-]/);
            dateValue = new Date(
              parseInt(parts[2], 10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[0], 10)
            );
          }

          return {
            category: row.categoria,
            description: row.descripcion,
            amount: parseFloat(row.monto.toString().replace(',', '.')),
            date: dateValue
          };
        });

        onDataImported(processedData);
        showAlert(`${processedData.length} registros importados correctamente`, 'success');

        // Limpiar el input file
        event.target.value = '';

      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        showAlert('Error al procesar el archivo Excel', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        component="label"
      >
        Importar Excel
        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </Button>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{
            width: '100%',
            whiteSpace: 'pre-line',
            '&.MuiAlert-filledSuccess': {
              backgroundColor: '#2e7d32'
            },
            '&.MuiAlert-filledError': {
              backgroundColor: '#d32f2f'
            }
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}