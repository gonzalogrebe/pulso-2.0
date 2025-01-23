import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateEmbedding } from '@/utils/embeddings';

export async function POST() {
  try {
    const documents = [
      { title: 'Documento 1', content: 'Contenido del documento 1' },
      { title: 'Documento 2', content: 'Contenido del documento 2' },
    ];

    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.content);
      await prisma.knowledgeBase.create({
        data: {
          title: doc.title,
          content: doc.content,
          embedding,
        },
      });
    }

    return NextResponse.json({ message: 'Base de conocimientos poblada correctamente.' });
  } catch (error) {
    console.error('Error en populateKnowledge:', error);
    return NextResponse.json({ error: 'Error al poblar la base de conocimientos.' }, { status: 500 });
  }
}
