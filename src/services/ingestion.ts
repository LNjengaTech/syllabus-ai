//This service that handles the heavy lifting of ingesting PDF documents, converting them into text, chunking that text, generating vector embeddings, and storing those embeddings in Pinecone for later retrieval.

import pdf from '@cedrugs/pdf-parse';
import { index } from "@/src/lib/pinecone";
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function ingestPdf(buffer: Buffer, fileId: string, userId: string) {
  try {
    const data = await pdf(buffer);
    const rawText = data.text;

    if (!rawText?.trim()) {
      throw new Error('PDF contains no text');
    }

  //chunking text into ~500-1000 character pieces
  const chunks = rawText.match(/[\s\S]{1,1000}/g) || [];

  //generate real embeddings using Hugging Face
  const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
  
  const embeddings = await hf.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: chunks,
  }) as number[][];

  const vectors = chunks.map((chunk: string, i:number) => ({
    id: `${fileId}-${i}`,
    values: embeddings[i], //the actual math vectors
    metadata: {
      text: chunk,
      userId,
      fileId,
    },
  }));

  //upsert to Pinecone (index dimension should be set to 384 for this model)
  await index.upsert(vectors);
  
  return { success: true, chunkCount: chunks.length };

  } catch (error) {
    console.error('PDF ingestion error:', error);
    throw error;
  }
}