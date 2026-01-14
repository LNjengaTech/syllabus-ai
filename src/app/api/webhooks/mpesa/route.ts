import { NextResponse } from "next/server";
import { upsertUserProfile } from "@/src/lib/subscription";

/**
 * M-Pesa Callback Handler
 * Safaricom will POST to this URL after STK Push completion
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

        const resultCode = body.Body?.stkCallback?.ResultCode;
        const resultDesc = body.Body?.stkCallback?.ResultDesc;
        const metadata = body.Body?.stkCallback?.CallbackMetadata;

        if (resultCode === 0) {
            // Payment successful
            const items = metadata?.Item || [];

            // Extract transaction details
            const amount = items.find((i: any) => i.Name === "Amount")?.Value;
            const mpesaReceiptNumber = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
            const phoneNumber = items.find((i: any) => i.Name === "PhoneNumber")?.Value;

            console.log(`✅ M-Pesa payment successful: ${mpesaReceiptNumber} - KES ${amount}`);

            // Extract userId from AccountReference (format: SYLLABUS-{userId})
            const accountRef = items.find((i: any) => i.Name === "AccountReference")?.Value;
            const userId = accountRef?.replace("SYLLABUS-", "");

            if (userId) {
                // Grant premium access for 1 month
                const subscriptionEndDate = new Date();
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

                await upsertUserProfile(userId, {
                    is_premium: true,
                    subscription_end_date: subscriptionEndDate.toISOString(),
                });

                console.log(`✅ User ${userId} upgraded to Premium via M-Pesa`);
            } else {
                console.error("Could not extract userId from M-Pesa callback");
            }
        } else {
            // Payment failed or cancelled
            console.log(`❌ M-Pesa payment failed: ${resultDesc}`);
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (error) {
        console.error("M-Pesa callback error:", error);
        return NextResponse.json(
            { ResultCode: 1, ResultDesc: "Failed to process callback" },
            { status: 500 }
        );
    }
}
