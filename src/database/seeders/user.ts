import { faker } from '@faker-js/faker';
import type { Prisma, User, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Context, getContext } from '../context';

const ctx: Context = getContext();

const hashPassword = (password: string = 'password'): string => {
  return hashSync(password, 10);
};

const createUserData = (
  isAdmin: boolean = false,
  hasPaid: boolean = false,
  postCode: string = '14141',
): Prisma.UserCreateInput => {
  return {
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    country: faker.location.country(),
    city: faker.location.city(),
    postCode: postCode,
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    linkedInUrl: faker.internet.url(),
    jobTitle: faker.person.jobTitle(),
    companyName: faker.company.name(),
    commercialName: faker.company.name(),
    companyCountry: faker.location.country(),
    companyCity: faker.location.city(),
    companyPostCode: postCode,
    companyWebsite: faker.internet.url(),
    companyLinkedInPage: faker.internet.url(),
    companyPhoneNumber: faker.phone.number(),
    revenue: parseFloat(faker.commerce.price()),
    revenueFileUrl:
      'gs://juugap-d789f.appspot.com/revenueFiles/ClubdesCEO-CDC.pdf',
    isValidatedByAdmin: false,
    password: hashPassword(),
    role: isAdmin ? 'ADMIN' : 'MEMBER',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

export const createUsers = async (arg: {
  prismaClient: PrismaClient;
}): Promise<User[]> => {
  const { prismaClient } = arg;
  const usersData = [
    createUserData(true),
    ...Array.from({ length: 5 }, () => createUserData()),
  ];

  await ctx.prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  const users = await prismaClient.user.findMany({
    where: {
      email: { in: usersData.map(user => user.email) },
    },
  });

  return users;
};
