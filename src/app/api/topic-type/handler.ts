import { TopicTypeInput, TopicTypeOutput } from "@/typings/topic-type";
import * as topicTypeRepository from "@/database/repository/topicType.repository";

const handleCreate = async (data: TopicTypeInput): Promise<TopicTypeOutput | null> => {
  const topicType = await topicTypeRepository.save(data);
  if (!topicType) return null;
  return topicType
}

export { handleCreate } 