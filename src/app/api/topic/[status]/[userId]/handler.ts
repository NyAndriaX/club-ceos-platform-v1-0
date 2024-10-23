import { Prisma, PrismaClient, Topic } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleCreate = async (data: Prisma.TopicCreateInput): Promise<Topic | null> => {
  const topic = await prisma.topic.create({ data })

  if (!topic) return null;

  return topic;
};

const handleGetAllTopics = async (data?: any): Promise<Topic[] | []> => {
  const topics = await prisma.topic.findMany({ where: data })

  if (!topics) return [];

  return topics;
};

export { handleCreate, handleGetAllTopics };
