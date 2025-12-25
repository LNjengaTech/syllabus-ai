//conecting my app to pinecone vector db

import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is missing");
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);