import { TopicTypeInput, TopicTypeOutput } from "@/typings/topic-type";
import { Context, getContext } from "../context";


const ctx: Context = getContext();

export async function save(data: TopicTypeInput): Promise<TopicTypeOutput> {
  return ctx.prisma.topicType.create({
    data
  })
}