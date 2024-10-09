import { Reply, Prisma } from "@prisma/client"
import * as topicReplyRepository from "@/database/repository/topicReply.repository"

const handleCreate = async (data: Prisma.ReplyCreateInput): Promise<Reply | null> => {
  const topicReply = await topicReplyRepository.save(data);

  if (!topicReply) return null;

  return topicReply
}

export { handleCreate }