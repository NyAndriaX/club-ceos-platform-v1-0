import { User } from "@prisma/client";
import * as userRepository from '@/database/repository/user.repository';

const handleGetUsersAwaitingApproval = async (): Promise<Omit<User, 'password'>[] | null> => {
  const users = await userRepository.findMany({ isValidatedByAdmin: false });

  if (!users) return null;

  await userRepository.updateMany(users, { isNew: false })

  const usersWithoutPassword = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

  return usersWithoutPassword;
};

const handleGetApprovedUser = async (): Promise<Omit<User, 'password'>[] | null> => {
  const users = await userRepository.findMany({ isValidatedByAdmin: true });

  if (!users) return null;

  await userRepository.updateMany(users, { isNew: false })

  const usersWithoutPassword = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

  return usersWithoutPassword;

}

const handleApproveAUser = async (userId: number): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.update({ isValidatedByAdmin: true }, userId);

  if (!user) return null;

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword
}

const handleUnapproveUser = async (userId: number): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.deleteByUserId(userId);
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword
}

export { handleGetUsersAwaitingApproval, handleGetApprovedUser, handleApproveAUser, handleUnapproveUser }