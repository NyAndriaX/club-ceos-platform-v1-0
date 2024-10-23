import { Reply, PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleGetAllTopicReplies = async (data: {
  topicId: number;
}): Promise<Reply[] | []> => {
  const topicReplies = await prisma.reply.findMany({
    where: { topicId: data.topicId }
  });


  if (!topicReplies) return [];

  return topicReplies;
};

export { handleGetAllTopicReplies };
