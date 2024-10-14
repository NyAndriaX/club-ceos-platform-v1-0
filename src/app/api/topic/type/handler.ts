import { TopicTypeInput, TopicTypeOutput } from '@/typings/topic';
import * as topicTypeRepository from '@/database/repository/topicType.repository';

const handleCreate = async (
  data: TopicTypeInput,
): Promise<TopicTypeOutput | null> => {
  const topicType = await topicTypeRepository.save(data);
  if (!topicType) return null;
  return topicType;
};

const handleGetAllTopicTypes = async (
  data?: any,
): Promise<TopicTypeOutput[] | []> => {
  const topicTypes = await topicTypeRepository.findMany();

  if (!topicTypes) return [];

  return topicTypes;
};

export { handleCreate, handleGetAllTopicTypes };
