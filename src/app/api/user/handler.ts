import { User } from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleCreate = async (
  data: Prisma.UserCreateInput,
): Promise<Omit<User, 'password'> | null> => {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } })

  if (existingEmail) throw new Error('Cet email est déjà utilisé');

  const user = await prisma.user.create(
    { data }
  )

  if (!user) return null;

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const handleGetAllUsers = async (): Promise<
  Omit<User, 'password'>[] | null
> => {
  const users = await prisma.user.findMany({
    where: {
      isValidatedByAdmin: true,
      role: 'MEMBER',
      subscriptionId: {
        not: null,
      },
      customerId: {
        not: null,
      },
      planId: {
        not: null,
      },
    }

  });

  if (!users) return [];

  const usersWithoutPassword = users?.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword,
  );

  return usersWithoutPassword;
};

export { handleCreate, handleGetAllUsers };
