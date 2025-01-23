// src/components/ExcelUploader.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Input,
  CircularProgress,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setSuccessMessage(null);
      setErrorMessage(null);
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

      if (!response.ok) {
        throw new Error('Error al procesar el archivo.');
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Archivo procesado exitosamente.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Hola! Sé que tus datos son de lo mejor y están estructurados como un experto,
        pero quizás puedo ayudarte a mejorarlos. Entrégame ese hermoso Excel y lo procesaré.
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Seleccionar Archivo
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            sx={{ display: 'none' }}
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
    </Box>
  );
}
