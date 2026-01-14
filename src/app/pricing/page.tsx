"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { Check, Crown, Zap, Shield, Sparkles } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<"stripe" | "mpesa" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleStripeCheckout = async () => {
    setLoading("stripe");
    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Stripe checkout failed:", error);
      alert("Failed to start Stripe checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleMpesaCheckout = async () => {
    if (!phoneNumber.match(/^254\d{9}$/)) {
      alert("Please enter a valid phone number (e.g., 254712345678)");
      return;
    }

    setLoading("mpesa");
    try {
      const response = await fetch("/api/checkout/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount: 5 }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("✅ " + data.message);
      } else {
        alert("❌ " + (data.error || "Payment failed"));
      }
    } catch (error) {
      console.error("M-Pesa checkout failed:", error);
      alert("Failed to initiate M-Pesa payment. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-gray-100">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
              <div className="text-4xl font-extrabold mb-4">
                $0<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>3 PDF uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>AI-powered chat</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Basic flashcards</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Study summaries</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full py-3 px-6 rounded-full font-semibold bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-extrabold mb-4">
                $9.99<span className="text-lg font-normal opacity-80">/month</span>
              </div>
              <p className="text-sm opacity-90">or KES 999 via M-Pesa</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 mt-0.5" />
                <span className="font-semibold">Unlimited uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-yellow-300 mt-0.5" />
                <span>Priority AI processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-yellow-300 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                <span>Export to PDF/Anki</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-yellow-300 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>

            {user ? (
              <div className="space-y-3">
                
                
                <div className="border-t border-white/30 pt-3">
                  <p className="text-sm mb-2 opacity-90">M-Pesa Payment (enter your number)</p>
                  <input
                    type="tel"
                    placeholder="254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-lg text-black dark:text-white mb-2"
                  />
                  <button
                    onClick={handleMpesaCheckout}
                    disabled={loading !== null}
                    className="w-full py-3 px-6 rounded-full font-semibold bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading === "mpesa" ? "Sending STK..." : "Pay With M-Pesa"}
                  </button>
                </div>

                <button
                  onClick={handleStripeCheckout}
                  disabled={loading !== null}
                  className="w-full py-3 px-6 rounded-full font-semibold dark:bg-white bg-gray-200 text-blue-600 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {loading === "stripe" ? "Processing..." : "Pay with Card (Stripe)"}
                </button>

              </div>
            ) : (
              <button
                onClick={() => window.location.href = "/"}
                className="w-full py-3 px-6 rounded-full font-semibold bg-white text-blue-600 hover:bg-gray-100 transition"
              >
                Sign In to Upgrade
              </button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 bg-white dark:bg-gray-900 rounded-xl p-8">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can cancel your subscription at any time. You'll still have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is M-Pesa payment secure?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely. We use Safaricom's official Daraja API. We never store your M-Pesa PIN or personal payment information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens after 3 free uploads?</h3>
              <p className="text-muted-foreground text-sm">
                You'll be prompted to upgrade. Your existing files and chat history remain accessible, but new uploads require a Premium subscription.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
