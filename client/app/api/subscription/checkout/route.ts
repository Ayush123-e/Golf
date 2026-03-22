import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, charityId, percentage, phone, region, isDonation } = await req.json();

    let mode: Stripe.Checkout.Session.Mode = "subscription";
    let priceId;

    if (isDonation) {
      mode = "payment";
      priceId = region === "india" 
        ? process.env.STRIPE_INR_DONATION_PRICE_ID 
        : process.env.STRIPE_DONATION_PRICE_ID;
    } else {
      if (region === "india") {
        priceId = plan === "yearly" 
          ? process.env.STRIPE_INR_YEARLY_PRICE_ID 
          : process.env.STRIPE_INR_MONTHLY_PRICE_ID;
      } else {
        priceId = plan === "yearly" 
          ? process.env.STRIPE_YEARLY_PRICE_ID 
          : process.env.STRIPE_MONTHLY_PRICE_ID;
      }
    }

    if (!priceId) {
      return NextResponse.json({ error: `Stripe Price IDs not configured for region: ${region}` }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        charityId,
        percentage: percentage.toString(),
        phone,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
