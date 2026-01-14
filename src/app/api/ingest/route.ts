import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { ingestPdf } from "@/src/services/ingestion";
import { canUserUpload } from "@/src/lib/subscription";

export async function POST(req: Request) {
  //Verify if the user is logged in
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    // Check if user can upload (free limit or premium)
    const uploadStatus = await canUserUpload(userId);

    if (!uploadStatus.allowed) {
      return NextResponse.json(
        {
          error: "Free upload limit reached",
          message: `You've used all ${uploadStatus.uploadCount} free uploads. Upgrade to Premium for unlimited access!`,
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    const { fileUrl, fileId } = await req.json();

    //initialize Supabase Admin/or use your env variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

    //download the file from the 'syllabi' bucket
    const { data, error } = await supabase.storage.from('syllabi').download(fileUrl);

    if (error) {
      console.error("Supabase Download Error:", error);
      return NextResponse.json({ error: "Failed to download from Supabase" }, { status: 500 });
    }

    //convert the download to a Buffer for pdf-parse
    const buffer = Buffer.from(await data.arrayBuffer());

    //triggers the ingestion logic I wrote in ingestion.ts
    const result = await ingestPdf(buffer, fileId, userId);

    return NextResponse.json({
      message: "Ingestion complete",
      details: result
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Critical Ingestion Route Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}