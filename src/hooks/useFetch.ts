// src/hooks/useFetch.ts

import { useState, useEffect } from 'react';

export function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Evita establecer el estado si el componente se desmonta
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error al fetch: ${response.statusText}`);
        }
        const result: T = await response.json();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Limpieza para evitar actualizaciones de estado en componentes desmontados
    };
  }, [url]);

  return { data, loading, error };
}
