import { User } from "@prisma/client";
import { UserInput } from "@/typings";
import { Context, getContext } from "../context";

const ctx: Context = getContext();

export async function save(data: UserInput): Promise<User> {
  return ctx.prisma.user.create({
    data
  })
}

export async function findUserById(userId: number): Promise<User | null> {
  return ctx.prisma.user.findUnique({
    where: { id: userId }
  })
}

export async function update(data: Partial<UserInput>, userId: number): Promise<User> {
  return ctx.prisma.user.update({
    where: { id: userId },
    data
  })
}

export async function deleteByUserId(userId: number): Promise<User> {
  return ctx.prisma.user.delete({
    where: { id: userId }
  })
}

export async function findUnique(data: any): Promise<User | null> {
  return ctx.prisma.user.findUnique({
    where: data
  })
}

export async function findMany(data: any): Promise<User[] | null> {
  return ctx.prisma.user.findMany({
    where: data,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function updateMany(users: User[], data: Partial<UserInput>): Promise<User[] | null> {
  await ctx.prisma.user.updateMany({
    where: { id: { in: users.map(user => user.id) } },
    data: data,
  });
  return await ctx.prisma.user.findMany({
    where: { id: { in: users.map(user => user.id) } }
  })
}
