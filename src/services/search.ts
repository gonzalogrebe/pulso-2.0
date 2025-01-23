import { prisma } from '@/lib/prisma';

/**
 * Busca documentos relevantes utilizando embeddings y similitud de coseno.
 * @param embedding - Embedding generado para la consulta.
 * @returns Documentos relevantes.
 */
export async function findRelevantDocuments(embedding: number[]): Promise<any[]> {
  const query = `
    SELECT id, title, content
    FROM knowledge_base
    ORDER BY embedding <=> $1::vector
    LIMIT 5
  `;

  const results = await prisma.$queryRawUnsafe(query, embedding);

  return results;
}
