import { User as PrismaUser } from '@prisma/client';

export interface Session {
  user: PrismaUser;
  token?: string;
}
