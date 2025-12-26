//this endpoint will be called when a student clicks a "Generate Flashcards" button.


import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getContextWithRetry, generateStudyMaterial } from "@/src/services/study-guide";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { type } = await req.json();

    //Trying to get context with polling/retry
    const context = await getContextWithRetry(userId);

    if (!context) {
      //Returning 404 to tell the UI that the file isn't ready yet
      return NextResponse.json(
        { error: "Syllabus is still being processed by the AI. Please wait 5 seconds." }, 
        { status: 404 }
      );
    }

    //Generate the material
    const result = await generateStudyMaterial(context, type);

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}