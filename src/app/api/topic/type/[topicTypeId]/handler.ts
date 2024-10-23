import { Prisma, PrismaClient, TopicType } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

const handleDelete = async (topicTypeId: number): Promise<TopicType> => {
  const topicType = await prisma.topicType.delete({ where: { id: topicTypeId } });

  if (!topicType) throw new Error('Type de thématique non trouvé');

  return topicType;
};


const handleGetTopicType = async (
  topicTypeId: number,
): Promise<TopicType | null> => {
  const topicType = await prisma.topicType.findUnique({ where: { id: topicTypeId } })

  if (!topicType) null;

  return topicType;
};

export { handleDelete, handleGetTopicType };
