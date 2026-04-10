import { getPdfChunkCollection } from "../../config/chroma";
import { openai } from "../../config/openai";
import { commonQueryEmbedding } from "../../services/rag.service";

export const createPdfEmbedding = async (pdf: string) => {
    try {
        // const pdfEmbedding = await generateEmbedding(pdf);
    } catch (error) {
        console.error("Error creating pdf embedding:", error);
        throw error;
    }
};

export const findPdfQueryResults = async (query: string, documentId?: string) => {
    try {
        const { embedding } = await commonQueryEmbedding(query);
        const collection = await getPdfChunkCollection();
        const results = await collection.query({
            queryEmbeddings: [embedding],
            nResults: 5,
            where: documentId ? { documentId } : undefined,
        });

        const contextDocs = results.documents?.[0] ?? [];
        const context = contextDocs.join("\n");
        const prompt = generatePrompt(context, query);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        return {
            answer: response.choices[0].message.content,
        };
    } catch (error) {
        console.error("Error finding PDF query results:", error);
        throw error;
    }
};

function generatePrompt(context: string, query: string) {
    return `
  You are a helpful and friendly chatbot.

  Use ONLY the context below to answer the question.

  If the answer is not available, respond politely that you don't have enough information.

  Context:
  ${context}

  User Question:
  ${query}

  Answer in a conversational way:
  `;
}