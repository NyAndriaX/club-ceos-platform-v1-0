import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  interface User extends Omit<PrismaUser, 'password' | 'isValidatedByAdmin'> {
    id: number;
  }
  interface Session {
    user: User;
  }
}
