import { TopicInput, TopicOutput } from "@/typings/topic";
import * as topicRepository from "@/database/repository/topic.repository";

const handleCreate = async (data: TopicInput): Promise<TopicOutput | null> => {
  const topic = await topicRepository.save(data);

  if (!topic) return null;

  return topic
}

export { handleCreate }