import { prisma } from '@/lib/prisma';
import { generateEmbedding } from '@/utils/embeddings';

/**
 * Agrega un documento a la base de conocimientos.
 * @param title - Título del documento.
 * @param content - Contenido del documento.
 */
export async function addKnowledgeDocument(title: string, content: string) {
  const embedding = await generateEmbedding(content);

  await prisma.knowledgeBase.create({
    data: {
      title,
      content,
      embedding,
    },
  });

  console.log(`Documento "${title}" añadido a la base de conocimientos.`);
}
