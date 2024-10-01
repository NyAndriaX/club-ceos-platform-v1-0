import { ThemeInput, ThemeOutput } from "@/typings/theme";
import { Context, getContext } from "../context";

const ctx: Context = getContext();

export async function save(data: ThemeInput): Promise<ThemeOutput> {
  return ctx.prisma.theme.create({
    data
  })
}

export async function findMany(data?: any): Promise<ThemeOutput[] | []> {
  return ctx.prisma.theme.findMany({
    where: data || undefined,
    orderBy: {
      createdAt: 'desc',
    },
  })
}