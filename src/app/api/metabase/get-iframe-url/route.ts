import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    // Intenta leer el cuerpo de la solicitud
    const body = await request.json().catch(() => null);

    if (!body || !body.token) {
      return NextResponse.json(
        { error: 'El token es obligatorio y debe estar en formato JSON.' },
        { status: 400 }
      );
    }

    const { token } = body;

    const metabaseURL = process.env.NEXT_PUBLIC_METABASE_URL;

    if (!metabaseURL) {
      return NextResponse.json(
        { error: 'La URL de Metabase no está configurada.' },
        { status: 500 }
      );
    }

    const cleanMetabaseURL = metabaseURL.replace(/\/+$/, '');
    const iframeURL = `${cleanMetabaseURL}/embed/dashboard/${token}#bordered=true&titled=true`;

    return NextResponse.json({ iframeURL });
  } catch (error) {
    console.error('Error al generar la URL del iframe:', error);
    return NextResponse.json(
      { error: 'Error al generar la URL del iframe.' },
      { status: 500 }
    );
  }
};
