import axios from 'axios';

/**
 * Genera embeddings utilizando el modelo de OpenAI.
 * @param text - Texto para generar embeddings.
 * @returns Embedding en formato de array de números.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      model: 'text-embedding-ada-002',
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data[0].embedding;
}
