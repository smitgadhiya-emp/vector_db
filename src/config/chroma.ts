import { CloudClient, Collection } from "chromadb";
import { env } from "./env";

export const client = new CloudClient({
  apiKey: env.CHROMA_API_KEY,
  tenant: env.CHROMA_TENANT,
  database: env.CHROMA_DATABASE,
});

export const USER_COLLECTION = "users";

let userCollectionPromise: Promise<Collection> | null = null;

export const getUserCollection = (): Promise<Collection> => {
  if (!userCollectionPromise) {
    userCollectionPromise = client.getOrCreateCollection({ name: USER_COLLECTION });
  }
  return userCollectionPromise;
};

