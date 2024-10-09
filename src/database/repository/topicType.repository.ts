import { TopicTypeInput, TopicTypeOutput } from "@/typings/topic";
import { Context, getContext } from "../context";


const ctx: Context = getContext();

export async function save(data: TopicTypeInput): Promise<TopicTypeOutput> {
  return ctx.prisma.topicType.create({
    data
  })
}

export async function findMany(data?: any): Promise<TopicTypeOutput[] | []> {
  return ctx.prisma.topicType.findMany({
    where: data || undefined
  })
}

export async function deleteByTopicTypeId(topicTypeId: number): Promise<TopicTypeOutput> {
  return ctx.prisma.topicType.delete({
    where: { id: topicTypeId }
  })
}

export async function findTopicTypeById(topicTypeId: number): Promise<TopicTypeOutput | null> {
  return ctx.prisma.topicType.findUnique({
    where: { id: topicTypeId }
  })
}