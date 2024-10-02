import { TopicInput, TopicOutput } from "@/typings/topic";
import { Context, getContext } from "../context";

const ctx: Context = getContext();

export async function save(data: TopicInput): Promise<TopicOutput> {
  return ctx.prisma.topic.create({
    data
  })
}

export async function findMany(data?: any): Promise<TopicOutput[] | []> {
  return ctx.prisma.topic.findMany({
    where: data || undefined,
    orderBy: {
      createdAt: 'desc',
    },
  })
}