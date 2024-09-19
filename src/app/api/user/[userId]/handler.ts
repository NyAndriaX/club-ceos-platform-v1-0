import { User } from "@prisma/client"
import * as userRepository from "@/database/repository/user.repository"

const handleGetUser = async (userId: number): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.findUserById(userId);

  if (!user) throw new Error('Utilisateur non trouvé')

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword
}

export { handleGetUser }