import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

export const pinecone = new PineconeClient();
export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
