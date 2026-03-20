import { createAdminClient } from '../../../../../server/lib/supabaseServer';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
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
      const userId = session.metadata?.userId;

      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: session.metadata?.plan,
          status: 'active',
          start_date: new Date().toISOString(),
        });
      break;

    case 'customer.subscription.deleted':
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
