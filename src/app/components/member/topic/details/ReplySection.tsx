import React from 'react';
import { User as PrismaUser } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Reply } from '@prisma/client';
import { ReplyForm } from './ReplyForm';
import { TopicRepliesList } from './TopicRepliesList';

interface ReplySectionProps {
  isLoading: boolean;
  currentUser: PrismaUser | null;
  defaultProfileImage: string;
  topicReplies: (Reply & { author: PrismaUser })[] | [];
  onReply: (values: Partial<Prisma.ReplyCreateInput>) => Promise<void>;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  isLoading,
  currentUser,
  defaultProfileImage,
  topicReplies,
  onReply,
}) => {
  return (
    <div className="flex flex-col gap-2 items-start ">
      <TopicRepliesList
        currentUser={currentUser}
        topicReplies={topicReplies}
        defaultProfileImage={defaultProfileImage}
      />
      <ReplyForm isLoading={isLoading} onReply={onReply} />
    </div>
  );
};
