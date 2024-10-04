import { TopicTypeOutput } from "@/typings/topic";
import * as topicTypeRepository from "@/database/repository/topicType.repository";

const handleDelete = async (topicTypeId: number): Promise<TopicTypeOutput> => {
  const topicType = await topicTypeRepository.deleteByTopicTypeId(topicTypeId);

  if (!topicType) throw new Error('Type de thématique non trouvé');

  return topicType
}

export { handleDelete }