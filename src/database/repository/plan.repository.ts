import { Plan } from '@prisma/client';
import { Context, getContext } from '../context';

const ctx: Context = getContext();

export async function findUnique(data: any): Promise<Plan | null> {
  return ctx.prisma.plan.findUnique({
    where: data,
  });
}
