import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, charityId, percentage, phone, region, isDonation } = await req.json();

    // Indian region is FREE and bypasses Stripe
    if (region === "india") {
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: plan,
          status: 'active',
          plan_region: 'india',
          start_date: new Date().toISOString(),
          end_date: plan === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, { onConflict: 'user_id' });

      if (subError) throw subError;

      // Update profile
      await supabase
        .from('profiles')
        .update({ is_active_subscriber: true, phone_number: phone })
        .eq('id', user.id);

      // Save charity preference
      if (charityId) {
        await supabase
          .from('user_charities')
          .upsert({
            user_id: user.id,
            charity_id: charityId,
            percentage: parseInt(percentage)
          }, { onConflict: 'user_id' });
      }

      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/dashboard?success=true` });
    }

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
