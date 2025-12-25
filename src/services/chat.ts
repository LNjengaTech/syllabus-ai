//This is where the magic happens - the app will search Pinecone for relevant syllabus snippets and send them to Groq (Llama 3) to answer student questions.

import { index } from "@/src/lib/pinecone";
import { HfInference } from "@huggingface/inference";
import Groq from "groq-sdk";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function querySyllabus(question: string, userId: string) {
  // 1. Turn the user's question into a vector
  const queryEmbedding = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: question,
  }) as number[];

  // 2. Search Pinecone for the top 3 most relevant chunks
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 3,
    filter: { userId: { $eq: userId } }, // Only search this user's files
    includeMetadata: true,
  });

  // 3. Extract the text from the results
  const context = queryResponse.matches
    .map((match) => match.metadata?.text)
    .join("\n\n");

  // 4. Send context + question to Groq (Llama 3)
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful study assistant. Use the following excerpts from a course syllabus to answer the student's question. If the answer isn't in the context, say you don't know based on the provided material.
        
        CONTEXT:
        ${context}`,
      },
      { role: "user", content: question },
    ],
    model: "llama3-8b-8192",
  });

  return chatCompletion.choices[0].message.content;
}