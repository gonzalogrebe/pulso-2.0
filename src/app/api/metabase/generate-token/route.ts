// Ruta: src/app/api/metabase/generate-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const POST = async (request: Request) => {
  try {
    const { dashboardId, parameters } = await request.json();

    if (!dashboardId) {
      return NextResponse.json(
        { error: 'El ID del dashboard es obligatorio.' },
        { status: 400 }
      );
    }

    const embeddingSecret = process.env.METABASE_EMBEDDING_SECRET;

    if (!embeddingSecret) {
      return NextResponse.json(
        { error: 'El secreto de Metabase no está configurado.' },
        { status: 500 }
      );
    }

    const payload = {
      resource: { dashboard: dashboardId },
      params: parameters || {}, // Filtro por parámetros
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira en 1 hora
    };

    const token = jwt.sign(payload, embeddingSecret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error al generar el token:', error);
    return NextResponse.json(
      { error: 'Error al generar el token.' },
      { status: 500 }
    );
  }
};
