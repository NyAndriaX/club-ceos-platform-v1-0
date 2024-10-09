import { TopicOutput } from "@/typings/topic";
import * as topicRepository from "@/database/repository/topic.repository";

const handleGetTopicById = async (topicId: number): Promise<TopicOutput | null> => {
  const topic = await topicRepository.findTopicById(topicId);

  if (!topic) return null;

  return topic
}

export { handleGetTopicById }