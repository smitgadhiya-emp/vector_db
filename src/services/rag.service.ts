import { generateQueryEmbedding } from "./embedding.service";

export interface QueryResult {
  query: string;
  embedding: number[];
  timestamp: Date;
}

export const commonQueryEmbedding = async (query: string): Promise<QueryResult> => {
  try {
    const embedding = await generateQueryEmbedding(query);
    return {
      query,
      embedding,
      timestamp: new Date(),
    };
  } catch (err) {
    console.error("Error in common query embedding:", err);
    throw err;
  }
};

export const processMultipleQueries = async (
  queries: string[]
): Promise<QueryResult[]> => {
  try {
    const results = await Promise.all(
      queries.map(async (query) => commonQueryEmbedding(query))
    );
    return results;
  } catch (err) {
    console.error("Error processing multiple queries:", err);
    throw err;
  }
};
