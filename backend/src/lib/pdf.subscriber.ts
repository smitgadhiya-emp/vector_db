import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createHash, randomUUID } from "crypto";
import { CHUNK_EMBEDDING_QUEUE_NAME, publishToQueue } from "../config/rabbitMQ";
import { generateEmbedding } from "../services/embedding.service";
import { getPdfChunkCollection } from "../config/chroma";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const MAX_CHROMA_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 1000;

type ChunkPayload = {
    chunk: string;
    index: number;
    total: number;
    metadata: {
        sourceType: "pdf";
        documentId: string;
        documentHash: string;
    };
};


type ChunkEmbeddingPayload = {
    chunk: string;
    index: number;
    total: number;
    metadata: {
      sourceType: "pdf";
      documentId: string;
      documentHash: string;
    };
  };

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "ChromaRateLimitError" ||
    error.message.toLowerCase().includes("rate limit")
  );
};

export const messageConsumeFromPdfQueueAndCreateChunk = async (message: Buffer) => {
    try {
        if (!Buffer.isBuffer(message) || message.length === 0) {
            throw new Error("Invalid PDF message received from queue");
        }

        const parser = new PDFParse({ data: new Uint8Array(message) });
        const parsedPdf = await parser.getText();
        await parser.destroy();
        const pdfText = parsedPdf.text?.trim();

        if (!pdfText) {
            throw new Error("No extractable text found in PDF");
        }

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: CHUNK_SIZE,
            chunkOverlap: CHUNK_OVERLAP,
        });

        const chunks = await splitter.splitText(pdfText);
        const nonEmptyChunks = chunks.filter((chunk: string) => chunk.trim().length > 0);
        const documentId = randomUUID();
        const documentHash = createHash("sha256").update(message).digest("hex");

        for (const [index, chunk] of nonEmptyChunks.entries()) {
            const payload: ChunkPayload = {
                chunk,
                index,
                total: nonEmptyChunks.length,
                metadata: {
                    sourceType: "pdf",
                    documentId,
                    documentHash,
                },
            };
            await publishToQueue(CHUNK_EMBEDDING_QUEUE_NAME, JSON.stringify(payload));
        }

        console.log(`Published ${nonEmptyChunks.length} chunks to ${CHUNK_EMBEDDING_QUEUE_NAME}`);
    } catch (error) {
        console.error("Error consuming from pdf queue: ", error);
        throw error;
    }
}


  const parseChunkEmbeddingPayload = (message: string): ChunkEmbeddingPayload => {
    const payload = JSON.parse(message) as ChunkEmbeddingPayload;
  
    if (!payload.chunk || typeof payload.chunk !== "string") {
      throw new Error("Invalid chunk payload: chunk is required");
    }
  
    if (!payload.metadata?.documentId || !payload.metadata?.documentHash) {
      throw new Error("Invalid chunk payload: metadata is required");
    }
  
    return payload;
  };
  
  export const messageConsumeFromChunkEmbeddingQueue = async (message: string) => {
    try {
      const payload = parseChunkEmbeddingPayload(message);
      const embedding = await generateEmbedding(payload.chunk);
      const collection = await getPdfChunkCollection();
      const chunkId = `${payload.metadata.documentId}:${payload.index}`;

    for (let attempt = 1; attempt <= MAX_CHROMA_RETRIES; attempt += 1) {
      try {
        await collection.upsert({
          ids: [chunkId],
          embeddings: [embedding],
          documents: [payload.chunk],
          metadatas: [
            {
              sourceType: payload.metadata.sourceType,
              documentId: payload.metadata.documentId,
              documentHash: payload.metadata.documentHash,
              chunkIndex: payload.index,
              totalChunks: payload.total,
            },
          ],
        });
        console.log(`Stored embedding for chunk ${chunkId}`);
        return;
      } catch (error) {
        const shouldRetry =
          isRateLimitError(error) && attempt < MAX_CHROMA_RETRIES;

        if (!shouldRetry) {
          throw error;
        }

        const backoffMs = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
        console.warn(
          `Rate limit while storing chunk ${chunkId}. Retry ${attempt}/${MAX_CHROMA_RETRIES} in ${backoffMs}ms`,
        );
        await sleep(backoffMs);
      }
    }
  
    throw new Error(`Unable to store embedding for chunk ${chunkId}`);
    } catch (error) {
      console.error("Error consuming from chunk embedding queue:", error);
      throw error;
    }
  };
  