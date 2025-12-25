//this endpoint will be called when a student clicks a "Generate Flashcards" button.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { index } from "@/src/lib/pinecone";
import { generateStudyMaterial } from "@/src/services/study-guide";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { type } = await req.json();

  try {
    // 1. Get the most important context from Pinecone (top 5 chunks)
    // We use a generic query to get the core material
    const queryResponse = await index.query({
      vector: new Array(384).fill(0), // Simple fetch
      topK: 5,
      filter: { userId: { $eq: userId } },
      includeMetadata: true,
    });

    const context = queryResponse.matches
      .map((match) => match.metadata?.text)
      .join("\n\n");

    // 2. Generate the material
    const result = await generateStudyMaterial(context, type);

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}