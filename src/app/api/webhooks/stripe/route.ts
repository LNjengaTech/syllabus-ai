import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { upsertUserProfile } from "@/src/lib/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 *stripe webhook handler
 * 
 *listens for checkout.session.completed events
 */
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    //handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            if (!userId) {
                console.error("No userId in webhook metadata");
                return new NextResponse("Missing userId", { status: 400 });
            }

            //calculate subscription end date (1 month from now)
            const subscriptionEndDate = new Date();
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

            //update user profile to premium
            await upsertUserProfile(userId, {
                is_premium: true,
                subscription_end_date: subscriptionEndDate.toISOString(),
            });

            console.log(`User ${userId} upgraded to Premium via Stripe`);
            break;
        }

        case "customer.subscription.deleted": {
            //handle subscription cancellation
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;

            if (userId) {
                await upsertUserProfile(userId, {
                    is_premium: false,
                });
                console.log(`User ${userId} subscription cancelled`);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
