import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import { stripe } from '@/app/stripe/stripe';
import { PrismaClient } from '@prisma/client';
import { sendPassword } from '@/app/services/passwordmail.service';
import generatePassword from 'generate-password';

const prisma: PrismaClient = new PrismaClient();

const PLAN_MAPPINGS = {
  [process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_100k_500k_PRICE_ID!]: 1,
  [process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_100k_500K_PRICE_ID!]: 2,
  [process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_501K_999K_PRICE_ID!]: 3,
  [process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_501K_999K_PRICE_ID!]: 4,
  [process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_1000K_9000K_PRICE_ID!]: 5,
  [process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_1000K_9000K_PRICE_ID!]: 6,
  [process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_10M_20M_PRICE_ID!]: 7,
  [process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_SUPERIEUR_20M_PRICE_ID!]: 6,
};

const createOrUpdateSubscription = async (priceId: string, userId: number) => {
  const planId = PLAN_MAPPINGS[priceId];
  if (!planId) {
    console.log(`Aucun plan trouvé pour le priceId: ${priceId}`);
    return;
  }

  let endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  return await prisma.subscription.upsert({
    where: { id: userId },
    create: {
      planId,
      startDate: new Date(),
      endDate,
      userId,
    },
    update: {
      planId,
      startDate: new Date(),
      endDate,
      userId,
    },
  })
};

const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  if (event.type !== 'checkout.session.completed') {
    console.log(`Type d'événement non géré : ${event.type}`);
    return;
  }

  const session = await stripe.checkout.sessions.retrieve(
    (event.data.object as Stripe.Checkout.Session).id,
    { expand: ['line_items'] },
  );

  const customerId = session.customer as string;
  const customerDetails = session.customer_details;

  if (!customerDetails?.email) {
    throw new Error('Détails du client non disponibles');
  }

  const user = await prisma.user.findUnique({
    where: { email: customerDetails.email }
  })
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  if (!user.customerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { customerId: customerId }
    })
  }

  const lineItems = session.line_items?.data || [];

  for (const item of lineItems) {
    const priceId = item.price?.id;
    const isSubscription = item.price?.type === 'recurring';

    if (isSubscription && priceId) {
      const subscription = await createOrUpdateSubscription(priceId, user.id);

      const newPassword = generatePassword.generate({
        length: 8,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
      });

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          planId: PLAN_MAPPINGS[priceId],
          subscriptionId: subscription!.id as number,
          password: hashedPassword,
        }
      })

      const response = await sendPassword({
        userEmail: user.email,
        password: newPassword,
      });

      if (!response.OK) {
        throw new Error("Échec de l'envoi de l'email");
      }
    } else {
      throw new Error('Produit non récurrent géré');
    }
  }
};

export { handleCheckoutSessionCompleted };
