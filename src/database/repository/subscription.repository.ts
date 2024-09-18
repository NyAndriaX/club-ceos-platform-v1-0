import { Subscription } from "@prisma/client";
import { getContext, Context } from "../context";
import { SubscriptionInput } from "@/typings/subscription";

const ctx: Context = getContext();

export async function upsert(data: SubscriptionInput, userId: number): Promise<Subscription | null> {
  const { userId: _, ...dataWithoutUserId } = data;

  return ctx.prisma.subscription.upsert({
    where: { userId },
    update: dataWithoutUserId,
    create: {
      userId,
      ...dataWithoutUserId
    }
  })
}