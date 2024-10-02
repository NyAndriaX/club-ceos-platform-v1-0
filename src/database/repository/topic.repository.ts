import { TopicInput, TopicOutput } from "@/typings/topic";
import { Context, getContext } from "../context";

const ctx: Context = getContext();

export async function save(data: TopicInput): Promise<TopicOutput> {
  return ctx.prisma.topic.create({
    data
  })
}