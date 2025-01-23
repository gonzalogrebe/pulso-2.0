import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmbedding } from '@/utils/embeddings'; // Usa la función previamente definida
import { prisma } from '@/lib/prisma';

async function populateKnowledge() {
  const documents = [
    {
      title: 'Gastos Mensuales',
      content: 'Descripción detallada de cómo gestionar gastos mensuales.',
    },
    {
      title: 'Ingresos Anuales',
      content: 'Información sobre la gestión de ingresos a lo largo del año.',
    },
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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await populateKnowledge();
    res.status(200).json({ message: 'Base de conocimientos poblada correctamente.' });
  } catch (error: any) {
    console.error('Error al poblar la base de conocimientos:', error);
    res.status(500).json({ error: 'Error al poblar la base de conocimientos.' });
  }
}
