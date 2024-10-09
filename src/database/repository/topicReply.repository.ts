import { Reply, Prisma } from "@prisma/client";
import { Context, getContext } from "../context";

const ctx: Context = getContext();

export async function save(data: Prisma.ReplyCreateInput): Promise<Reply> {
  return ctx.prisma.reply.create({
    data
  });
}


export async function findReplyTopicManyByTopicId(data: { topicId: number }): Promise<Reply[]> {
  return ctx.prisma.reply.findMany({
    where: {
      topicId: data.topicId,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
