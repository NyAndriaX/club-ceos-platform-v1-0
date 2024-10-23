import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleGetUser = async (
  userId: number,
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      topics: {
        include: {
          theme: true,
          type: true
        }
      }
    }
  })

  if (!user) throw new Error('Utilisateur non trouvé');

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const handlePutUser = async (
  userId: number,
  data: (Partial<User> & { currentPassword: string, confirmPassword: string, newPassword: string }),
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) throw new Error('Utilisateur non trouvé.');

  const isPasswordValid = await compare(
    data.currentPassword as string,
    user.password as string,
  );
  if (!isPasswordValid) throw new Error('Mot de passe invalide.');

  const { confirmPassword, currentPassword, newPassword, ...newValue } = data;

  if (newPassword) {
    newValue.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: newValue
  })

  const { password, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
};

export { handleGetUser, handlePutUser };
