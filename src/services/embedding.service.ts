import { openai } from "../config/openai";

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
};

export const generateQueryEmbedding = async (query: string): Promise<number[]> => {
  try {
    const embedding = await generateEmbedding(query);
    return embedding;
  } catch (err) {
    console.error("Error generating query embedding:", err);
    throw err;
  }
};

export const generateBatchEmbeddings = async (texts: string[]): Promise<number[][]> => {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    return res.data.map((item) => item.embedding);
  } catch (err) {
    console.error("Error generating batch embeddings:", err);
    throw err;
  }
};
