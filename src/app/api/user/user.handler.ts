import { User } from "@prisma/client"
import { UserInput } from "@/typings"
import * as userRepository from "@/database/repository/user.repository"

const handleCreate = async (data: UserInput): Promise<Omit<User, 'password'> | null> => {
  const user = await userRepository.save(data);

  if (!user) return null;

  const { password, ...userWithoutPassword } = user

  return userWithoutPassword
}

export { handleCreate }