import { TopicInput, TopicOutput } from '@/typings/topic';
import * as topicRepository from '@/database/repository/topic.repository';

const handleCreate = async (data: TopicInput): Promise<TopicOutput | null> => {
  const topic = await topicRepository.save(data);

  if (!topic) return null;

  return topic;
};

const handleGetAllTopics = async (data?: any): Promise<TopicOutput[] | []> => {
  const topics = await topicRepository.findMany(data);

  if (!topics) return [];

  return topics;
};

export { handleCreate, handleGetAllTopics };
