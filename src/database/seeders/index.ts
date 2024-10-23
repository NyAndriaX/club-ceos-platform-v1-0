import { PlanType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';
import { PrismaClient, TopicStatus } from '@prisma/client';

const prisma = new PrismaClient();

const hashPassword = (password: string = 'password'): string => {
  return hashSync(password, 10);
};

async function seedPlans() {
  await prisma.plan.createMany({
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
}

async function seedUsers() {
  const users = Array.from({ length: 10 }).map(() => ({
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    postCode: faker.location.zipCode(),
    country: faker.location.country(),
    city: faker.location.city(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    linkedInUrl: faker.internet.url(),
    jobTitle: faker.name.jobTitle(),
    companyName: faker.company.name(),
    companyCountry: faker.location.country(),
    companyCity: faker.location.city(),
    companyPostCode: faker.location.zipCode(),
    companyWebsite: faker.internet.url(),
    companyLinkedInPage: faker.internet.url(),
    companyPhoneNumber: faker.phone.number(),
    revenue: faker.number.int({ min: 1000, max: 1000000 }),
    revenueFileUrl: faker.internet.url(),
    password: hashPassword(),
    isValidatedByAdmin: faker.datatype.boolean(),
    planId: null,
    commercialName: faker.person.firstName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  await prisma.user.createMany({ data: users });
}


async function seedSubscriptions() {
  const subscriptions = Array.from({ length: 10 }).map(() => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    planId: faker.number.int({ min: 1, max: 8 }),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
  }));

  await prisma.subscription.createMany({ data: subscriptions });
}

async function seedThemes() {
  await prisma.theme.createMany({
    data: [
      { title: 'Technology', description: faker.lorem.sentence() },
      { title: 'Business', description: faker.lorem.sentence() },
    ],
  });
}

async function seedTopicTypes() {
  await prisma.topicType.createMany({
    data: [
      {
        name: 'Article',
        coverImage: faker.image.url(),
        description: faker.lorem.sentence(),
      },
      {
        name: 'Video',
        coverImage: faker.image.url(),
        description: faker.lorem.sentence(),
      },
    ],
  });
}

async function seedTopics() {
  const topics = Array.from({ length: 10 }).map(() => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    status: TopicStatus.PUBLISHED,
    themeId: faker.number.int({ min: 1, max: 10 }),
    userId: faker.number.int({ min: 1, max: 10 }),
    topicTypeId: faker.number.int({ min: 1, max: 2 }),
  }));

  await prisma.topic.createMany({ data: topics });
}


async function seedReplies() {
  const replies = Array.from({ length: 10 }).map(() => ({
    content: faker.lorem.sentence(),
    topicId: faker.number.int({ min: 1, max: 10 }),
    userId: faker.number.int({ min: 1, max: 10 }),
    votes: faker.number.int({ min: 0, max: 100 }),
  }));

  await prisma.reply.createMany({ data: replies });
}

async function seedVotes() {
  const votes = Array.from({ length: 10 }).map(() => ({
    replyId: faker.number.int({ min: 1, max: 10 }),
    userId: faker.number.int({ min: 1, max: 10 }),
  }));

  await prisma.vote.createMany({ data: votes });
}

async function main() {

  console.timeLog('Seeding database...');

  await seedPlans();
  await seedUsers();
  await seedSubscriptions();
  await seedThemes();
  await seedTopicTypes();
  await seedTopics();
  await seedReplies();
  await seedVotes();

  console.timeEnd('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
