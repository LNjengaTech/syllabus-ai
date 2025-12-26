// this service takes the same context used in the chat but formats it specifically for learning
// src/services/study-guide.ts
import Groq from "groq-sdk";
import { index } from "@/src/lib/pinecone";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getContextWithRetry(userId: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    //using a query that actually looks for the userId metadata
    const queryResponse = await index.query({
      //using a very small non-zero value to satisfy the vector requirement
      vector: new Array(384).fill(0.1), 
      topK: 10,
      filter: { userId: { $eq: userId } },
      includeMetadata: true,
    });

    //CHECK: Does Pinecone see any records for this user?
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      console.log(`Found ${queryResponse.matches.length} matches for user ${userId}`);
      return queryResponse.matches
        .map((match) => match.metadata?.text)
        .join("\n\n");
    }

    console.log(`Attempt ${i + 1}: Pinecone index for ${userId} not ready...`);
    if (i < retries - 1) await delay(2000);
  }
  return null;
}

export async function generateStudyMaterial(context: string, type: 'flashcards' | 'summary') {
  const prompts = {
    flashcards: `Based on the following syllabus content, create 5 high-quality flashcards. 
                 YOU MUST follow this EXACT format for every card:
                 Front: [Question] | Back: [Answer]
                 ---
                 Separate each card with three dashes (---). Do not include any introductory text.`,
    summary: `Provide a "High-Level Summary" of this material. 
              Use bullet points and bold headers. 
              Focus on the key concepts a student must master for an exam.`
  };

  const response = await groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You are an expert academic tutor. You output raw data without conversational fillers." 
      },
      { role: "user", content: `CONTEXT:\n${context}\n\nTASK: ${prompts[type]}` }
    ],
    model: "llama-3.1-8b-instant",
  });

  return response.choices[0].message.content;
}