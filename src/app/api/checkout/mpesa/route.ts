import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 *M-Pesa Daraja API - stk Push(Lipa Na M-Pesa Online)
 *this is just a simplified implementation for sandbox testing,complete implementation in later stages
 */

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { phoneNumber, amount } = await req.json();

        //validate phone number (Kenyan format: 254XXXXXXXXX)
        if (!phoneNumber || !phoneNumber.match(/^254\d{9}$/)) {
            return NextResponse.json(
                { error: "Invalid phone number. Use format: 254XXXXXXXXX" },
                { status: 400 }
            );
        }

        //getting mpesa access token
        const authString = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString("base64");

        const authResponse = await fetch(
            process.env.MPESA_AUTH_URL || "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                },
            }
        );

        const { access_token } = await authResponse.json();

        //initiating the stk Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);

        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

        const stkPushResponse = await fetch(process.env.MPESA_STK_URL || "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    BusinessShortCode: process.env.MPESA_SHORTCODE,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: "CustomerPayBillOnline",
                    Amount: amount || 5,
                    PartyA: phoneNumber,
                    PartyB: process.env.MPESA_SHORTCODE,
                    PhoneNumber: phoneNumber,
                    CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mpesa`,
                    AccountReference: `SYLLABUS-${userId}`,
                    TransactionDesc: "Syllabus AI Premium Subscription",
                }),
            }
        );


        const stkData = await stkPushResponse.json();
        console.log("M-PESA DATA:", stkData);

        if (stkData.ResponseCode === "0") {
            return NextResponse.json({
                success: true,
                message: "STK push sent. Check your phone to complete payment.",
                checkoutRequestID: stkData.CheckoutRequestID,
            });
        } else {
            return NextResponse.json(
                { error: stkData.ResponseDescription || "STK Push failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("M-Pesa STK Push error:", error);
        return NextResponse.json(
            { error: "Failed to initiate M-Pesa payment" },
            { status: 500 }
        );
    }
}
