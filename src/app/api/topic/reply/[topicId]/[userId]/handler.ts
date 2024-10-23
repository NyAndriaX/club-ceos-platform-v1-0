import { Reply, Prisma, PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleCreate = async (
  data: Prisma.ReplyCreateInput,
): Promise<Reply | null> => {
  const topicReply = await prisma.reply.create({ data })

  if (!topicReply) return null;

  return topicReply;
};

export { handleCreate };
