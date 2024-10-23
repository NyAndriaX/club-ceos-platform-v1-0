import { User, PrismaClient } from '@prisma/client';
import { generateEncryptedKey } from '../utils/crypto';
import { sendPaymentLink } from '@/app/services/paymail.service';


const prisma: PrismaClient = new PrismaClient();

const handleGetUsersAwaitingApproval = async (): Promise<
  Omit<User, 'password'>[] | null
> => {
  const users = await prisma.user.findMany({
    where: {
      isValidatedByAdmin: false,
      role: 'MEMBER',
    }

  });

  if (!users) return null;

  await prisma.user.updateMany({ where: { id: { in: users.map(user => user.id) } }, data: { isNew: false } })

  const usersWithoutPassword = users.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword,
  );

  return usersWithoutPassword;
};

const handleGetApprovedUser = async (): Promise<
  Omit<User, 'password'>[] | null
> => {
  const users = await prisma.user.findMany({ where: { isValidatedByAdmin: true } })

  if (!users) return null;

  await prisma.user.updateMany({ where: { id: { in: users.map(user => user.id) } }, data: { isNew: false } })

  const usersWithoutPassword = users.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword,
  );

  return usersWithoutPassword;
};

const handleApproveAUser = async (
  userId: number,
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.update({ where: { id: userId }, data: { isValidatedByAdmin: true } })

  if (!user) return null;

  const expirationTime = 7 * 24 * 60 * 60 * 1000;

  const encryptedKey = await generateEncryptedKey({
    userId: user.id,
    expirationTime: expirationTime,
  });

  const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL!}/pricing?key=${encryptedKey}`;

  const response = await sendPaymentLink({
    userEmail: user.email,
    paymentLink,
  });

  if (!response.OK) {
    throw new Error("Échec de l'envoi de l'email");
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const handleUnapproveUser = async (
  userId: number,
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export {
  handleGetUsersAwaitingApproval,
  handleGetApprovedUser,
  handleApproveAUser,
  handleUnapproveUser,
};
