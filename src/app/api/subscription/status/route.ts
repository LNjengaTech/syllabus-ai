import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { canUserUpload } from "@/src/lib/subscription";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const status = await canUserUpload(userId);
        return NextResponse.json(status);
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch status' },
            { status: 500 }
        );
    }
}
