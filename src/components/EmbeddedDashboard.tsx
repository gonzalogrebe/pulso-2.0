// src/components/EmbeddedDashboard.tsx
'use client';

import { useEffect, useState } from 'react';

interface EmbeddedDashboardProps {
  dashboardId: number;
  parameters?: Record<string, any>;
}

export default function EmbeddedDashboard({ dashboardId, parameters }: EmbeddedDashboardProps) {
  const [iframeURL, setIframeURL] = useState('');

  useEffect(() => {
    const fetchIframeURL = async () => {
      try {
        const tokenResponse = await fetch('/api/metabase/generate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dashboardId, parameters }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Error al generar el token de embed.');
        }

        const { token } = await tokenResponse.json();

        if (token) {
          const metabaseURL = process.env.NEXT_PUBLIC_METABASE_URL;
          if (!metabaseURL) {
            throw new Error('La variable NEXT_PUBLIC_METABASE_URL no está configurada.');
          }
          const cleanMetabaseURL = metabaseURL.replace(/\/+$/, ''); // Asegura que la URL base no tenga barras finales
          const iframeURL = `${cleanMetabaseURL}/embed/dashboard/${token}#bordered=true&titled=true`;
          setIframeURL(iframeURL);
        } else {
          console.error('Error: No se pudo generar el token.');
        }
      } catch (error) {
        console.error('Error al cargar el iframe URL:', error);
      }
    };

    fetchIframeURL();
  }, [dashboardId, parameters]);

  if (!iframeURL) return <p>Cargando dashboard...</p>;

  return (
    <iframe
      src={iframeURL}
      frameBorder="0"
      width="100%"
      height="600"
      title="Dashboard"
    />
  );
}
