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

  console.log('Base de conocimientos poblada correctamente.');
}

populateKnowledge()
  .catch((err) => {
    console.error('Error al poblar la base de conocimientos:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

