import dotenv from 'dotenv';

dotenv.config();

type Env = {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  CHROMA_API_KEY: string;
  CHROMA_TENANT:string;
  CHROMA_DATABASE:string;
  OPENAI_API_KEY: string;  
};

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/',
  CHROMA_API_KEY: process.env.CHROMA_API_KEY || '',
  CHROMA_TENANT: process.env.CHROMA_TENANT || '',
  CHROMA_DATABASE: process.env.CHROMA_DATABASE || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
};
