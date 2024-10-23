import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Avatar } from 'primereact/avatar';
import { Reply, User as PrismaUser } from '@prisma/client';
import { Button } from 'primereact/button';

interface TopicRepliesListProps {
  currentUser: PrismaUser | null;
  defaultProfileImage: string;
  topicReplies: (Reply & { author: PrismaUser })[] | [];
}

export const TopicRepliesList: React.FC<TopicRepliesListProps> = ({
  currentUser,
  defaultProfileImage,
  topicReplies,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(3);

  return (
    <div className="flex flex-col gap-6 w-full rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 pb-2">
        {topicReplies.length} réponse{topicReplies.length !== 1 ? 's' : ''}
      </h3>
      <div className="flex flex-col gap-6 w-full px-4">
        {topicReplies
          .slice(0, visibleCount)
          .map((topicReply, index: number) => (
            <div
              key={index}
              className={`flex flex-row w-full ${
                topicReply.author.id === currentUser?.id
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start w-full md:max-w-[80%] md:w-fit gap-4 p-4 border rounded-lg ${
                  topicReply.author.id === currentUser?.id
                    ? 'flex-row justify-end bg-blue-50 border-blue-400 shadow-sm text-right'
                    : 'flex-row-reverse justify-start md:bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200 text-left  shadow-sm'
                }`}
              >
                <div className="flex flex-col relative w-4/5 items-center gap-2">
                  <span className="text-base w-full font-bold text-gray-900">
                    {topicReply.author.firstName} {topicReply.author.lastName}
                  </span>
                  <div
                    dangerouslySetInnerHTML={{ __html: topicReply.content }}
                    className="text-sm w-full font-medium text-gray-900"
                  />
                  <span className="text-xs w-full text-gray-500">
                    Date de création :{' '}
                    {dayjs(topicReply.createdAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
                <Avatar
                  image={topicReply.author.profile ?? defaultProfileImage}
                  shape="circle"
                  size="large"
                  className="cursor-pointer w-12"
                />
              </div>
            </div>
          ))}
      </div>
      {visibleCount < topicReplies.length && (
        <Button
          icon="pi pi-angle-down"
          size="small"
          label="Afficher plus de réponses"
          text
          className="w-fit"
          onClick={() => setVisibleCount(prevCount => prevCount + 3)}
        />
      )}
    </div>
  );
};
