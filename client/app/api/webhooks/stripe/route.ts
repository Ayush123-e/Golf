import { createAdminClient } from '../../../../lib/supabaseServer';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, charityId, percentage, phone, plan, region } = session.metadata || {};

      if (!userId) break;


      await supabase
        .from('profiles')
        .update({
          phone_number: phone,
          is_profile_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);


      await supabase
        .from('subscriptions')
        .update({ status: 'inactive' })
        .eq('user_id', userId)
        .eq('status', 'active');


      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: plan,
          status: 'active',
          stripe_subscription_id: session.subscription as string,
          start_date: new Date().toISOString(),
          plan_region: region || 'uk',
        });


      if (charityId) {
        await supabase
          .from('user_charities')
          .upsert({
            user_id: userId,
            charity_id: charityId,
            percentage: parseInt(percentage || "10"),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }
      break;

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;
      const stripeCustomerId = subscription.customer as string;

      // Find the user by stripe customer ID (optional, or rely on active search)
      // For now, update any subscription with this stripe ID or status
      await supabase
        .from('subscriptions')
        .update({ 
          status: status === 'active' ? 'active' : 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
      break;

    case 'invoice.payment_failed':
      const invoice = event.data.object as any;
      const subId = invoice.subscription as string;
      
      if (subId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'inactive' })
          .eq('stripe_subscription_id', subId);
      }
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
