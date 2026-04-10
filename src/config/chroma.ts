import { CloudClient, Collection } from "chromadb";
import { env } from "./env";

export const client = new CloudClient({
  apiKey: env.CHROMA_API_KEY,
  tenant: env.CHROMA_TENANT,
  database: env.CHROMA_DATABASE,
});

export const USER_COLLECTION = "users";
export const PDF_CHUNK_COLLECTION = "pdf_chunks";

let userCollectionPromise: Promise<Collection> | null = null;
let pdfChunkCollectionPromise: Promise<Collection> | null = null;

export const getUserCollection = (): Promise<Collection> => {
  if (!userCollectionPromise) {
    userCollectionPromise = client.getOrCreateCollection({ name: USER_COLLECTION });
  }
  return userCollectionPromise;
};

export const getPdfChunkCollection = (): Promise<Collection> => {
  if (!pdfChunkCollectionPromise) {
    pdfChunkCollectionPromise = client.getOrCreateCollection({ name: PDF_CHUNK_COLLECTION });
  }
  return pdfChunkCollectionPromise;
};

