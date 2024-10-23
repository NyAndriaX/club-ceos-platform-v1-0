import React from 'react';
import { Topic } from '@prisma/client';

interface TopicContentProps {
  topic: Topic;
}

export const TopicContent: React.FC<TopicContentProps> = ({ topic }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: topic.content }}
      className="text-gray-900 w-full"
    />
  );
};
