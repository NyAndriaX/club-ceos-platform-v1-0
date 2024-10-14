import { Reply } from '@prisma/client';
import * as topicReplyRepository from '@/database/repository/topicReply.repository';

const handleGetAllTopicReplies = async (data: {
  topicId: number;
}): Promise<Reply[] | []> => {
  const topicReplies =
    await topicReplyRepository.findReplyTopicManyByTopicId(data);

  if (!topicReplies) return [];

  return topicReplies;
};

export { handleGetAllTopicReplies };
