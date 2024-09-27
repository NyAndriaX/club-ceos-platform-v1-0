import { User } from "@prisma/client"
import { UserInput } from "@/typings";
import bcrypt from 'bcryptjs';
import { compare } from "bcryptjs";
import * as userRepository from "@/database/repository/user.repository"

const handleGetUser = async (userId: number): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new Error('Utilisateur non trouvé')

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword
}

const handlePutUser = async (
  userId: number,
  data: Partial<UserInput>
): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('Utilisateur non trouvé.');

  const isPasswordValid = await compare(data.currentPassword as string, user.password as string);
  if (!isPasswordValid) throw new Error('Mot de passe invalide.');

  const { confirmPassword, currentPassword, newPassword, ...newValue } = data;

  if (newPassword) {
    newValue.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await userRepository.update(newValue, userId);

  const { password, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
};

export { handleGetUser, handlePutUser }