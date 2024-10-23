import { PrismaClient } from '@prisma/client';
import { TopicOutput } from '@/typings/topic';

const prisma: PrismaClient = new PrismaClient();

const handleGetTopicById = async (
  topicId: number,
): Promise<TopicOutput | null> => {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      author: true,
      theme: true,
      type: true,
      reply: {
        include: {
          author: true
        }
      }
    }
  })

  if (!topic) return null;

  return topic;
};

export { handleGetTopicById };
