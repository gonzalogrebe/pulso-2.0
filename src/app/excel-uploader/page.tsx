// src/components/ExcelUploader.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setSuccessMessage(null);
      setErrorMessage(null);
      setUploadedData([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Por favor, selecciona un archivo antes de subirlo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido.');
      }

      setSuccessMessage(data.message);
      setUploadedData(data.insertedData || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Subir Archivo Excel
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Seleccionar Archivo
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Archivo seleccionado: {file.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Subir y Procesar'}
      </Button>

      {successMessage && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {uploadedData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Datos Cargados:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Glosa</TableCell>
                  <TableCell>T</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Número Cta</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.tipo}</TableCell>
                    <TableCell>{row.categoria}</TableCell>
                    <TableCell>{row.glosa}</TableCell>
                    <TableCell>{row.t}</TableCell>
                    <TableCell>{row.monto}</TableCell>
                    <TableCell>{row.numero_cta}</TableCell>
                    <TableCell>
  {new Date(row.date).toLocaleDateString('es-CL', {
    timeZone: 'UTC',
  })}
</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
