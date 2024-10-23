import { Prisma, PrismaClient, TopicType } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

const handleCreate = async (
  data: Prisma.TopicTypeCreateInput,
): Promise<TopicType | null> => {
  const topicType = await prisma.topicType.create({ data })

  if (!topicType) return null;

  return topicType;
};

const handleGetAllTopicTypes = async (
  data?: any,
): Promise<TopicType[] | []> => {
  const topicTypes = await prisma.topicType.findMany();

  if (!topicTypes) return [];

  return topicTypes;
};

export { handleCreate, handleGetAllTopicTypes };
