// src/app/api/upload-excel/route.ts
import { NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo.' },
        { status: 400 }
      );
    }

    // Leer el archivo en formato binario
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = read(data, { type: 'array' });

    // Leer la primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(sheet, { defval: null });

    console.log('Datos procesados del Excel:', jsonData);

    // Normalizar nombres de campos ignorando tildes y case
    const normalizeField = (field) => field.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const requiredFields = ['Tipo', 'Categoría', 'Subcategoría', 'Item', 'Monto'].map(normalizeField);

    const normalizedData = jsonData.map((row) => {
      return Object.keys(row).reduce((acc, key) => {
        acc[normalizeField(key)] = row[key];
        return acc;
      }, {});
    });

    const invalidRows = normalizedData.filter((row) => {
      return !requiredFields.every(field => row[field] !== null && row[field] !== '');
    });

    if (invalidRows.length > 0) {
      return NextResponse.json(
        {
          error: `Existen filas con datos incompletos. Por favor revisa los campos requeridos: ${requiredFields.join(', ')}`,
          invalidRows,
        },
        { status: 400 }
      );
    }

    // Insertar los datos en la tabla Transactions
    const insertedData = await Promise.all(
      normalizedData.map(async (row) => {
        return await prisma.transaction.create({
          data: {
            tipo: row['tipo'],
            categoria: row['categoria'],
            subcategoria: row['subcategoria'],
            item: row['item'],
            glosa: row['glosa'],
            t: row['t'],
            numero_cta: parseFloat(row['numero_cta']),
            monto: parseFloat(row['monto']),
            date: row['fecha'] ? new Date((row['fecha'] - 25569) * 86400 * 1000) : new Date(),
          },
        });
      })
    );

    return NextResponse.json({
      message: 'Archivo procesado e insertado exitosamente.',
      insertedData,
    });
  } catch (error) {
    console.error('Error al procesar el archivo Excel:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo. Consulte los logs para más detalles.' },
      { status: 500 }
    );
  }
}
