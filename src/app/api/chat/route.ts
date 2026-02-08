//chat api route
//

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { querySyllabus } from "@/src/services/chat";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { message } = await req.json();

  try {
    const aiResponse = await querySyllabus(message, userId);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}