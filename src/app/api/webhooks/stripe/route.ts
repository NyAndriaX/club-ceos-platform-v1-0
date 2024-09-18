import Stripe from "stripe";
import { stripe } from "@/config/stripe";
import { handleCheckoutSessionCompleted } from "./handler";

const WEBHOOK_SECRET: string = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request): Promise<Response> {
  const body: string = await req.text();
  const sig: string | null = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing Stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET);
    console.log('router active');
    await handleCheckoutSessionCompleted(event);

  } catch (error: any) {
    console.error('La vérification de la signature du webhook a échoué.', error.message);
    return new Response(`Erreur du webhook : ${error.message}`, { status: 400 });
  }

  return new Response('Webhook reçu avec succès', { status: 200 });
}
