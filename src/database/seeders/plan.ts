import { Context, getContext } from '../context';
import { PlanType } from '@prisma/client';

const ctx: Context = getContext();

export const createPlans = async () => {
  await ctx.prisma.plan.createMany({
    data: [
      {
        name: 'Small Plan 100K-500K',
        type: PlanType.SMALL,
        minRevenue: 100000,
        maxRevenue: 500000,
        link: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_100K_500K || '',
        description:
          'Plan destiné aux petites entreprises avec un revenu entre 100K et 500K.',
      },
      {
        name: 'Large Plan 100K-500K',
        type: PlanType.LARGE,
        minRevenue: 100000,
        maxRevenue: 500000,
        link: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_100K_500K || '',
        description:
          'Plan pour les grandes entreprises avec un revenu entre 100K et 500K.',
      },
      {
        name: 'Small Plan 501K-999K',
        type: PlanType.SMALL,
        minRevenue: 501000,
        maxRevenue: 999000,
        link: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_501K_999K || '',
        description:
          'Plan destiné aux petites entreprises avec un revenu entre 501K et 999K.',
      },
      {
        name: 'Large Plan 501K-999K',
        type: PlanType.LARGE,
        minRevenue: 501000,
        maxRevenue: 999000,
        link: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_501K_999K || '',
        description:
          'Plan pour les grandes entreprises avec un revenu entre 501K et 999K.',
      },
      {
        name: 'Small Plan 1M-9M',
        type: PlanType.SMALL,
        minRevenue: 1000000,
        maxRevenue: 9000000,
        link: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_1000K_9000K || '',
        description:
          'Plan destiné aux petites entreprises avec un revenu entre 1M et 9M.',
      },
      {
        name: 'Large Plan 1M-9M',
        type: PlanType.LARGE,
        minRevenue: 1000000,
        maxRevenue: 9000000,
        link: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_1000K_9000K || '',
        description:
          'Plan pour les grandes entreprises avec un revenu entre 1M et 9M.',
      },
      {
        name: 'Small Plan 10M-20M',
        type: PlanType.SMALL,
        minRevenue: 10000000,
        maxRevenue: 20000000,
        link: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_10M_20M || '',
        description:
          'Plan destiné aux petites entreprises avec un revenu entre 10M et 20M.',
      },
      {
        name: 'Large Plan Supérieur à 20M',
        type: PlanType.LARGE,
        minRevenue: 20000000,
        maxRevenue: 2147483647,
        link: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_SUPERIEUR_20M || '',
        description:
          'Plan pour les grandes entreprises avec un revenu supérieur à 20M.',
      },
    ],
  });
};
