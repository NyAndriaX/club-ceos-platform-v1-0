import React from 'react';
import { Topic, TopicType } from '@prisma/client';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

interface TopicHeaderProps {
  topic: Topic;
  topicType: TopicType | null;
  router: any;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({
  topic,
  topicType,
  router,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-2 w-full rounded-t-md">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
        {topic.title}
      </h1>
      <div className="flex md:hidden">
        <div className="flex items-center flex-row gap-2">
          <Badge />
          <span className="text-gray-500">{topicType?.name}</span>
        </div>
      </div>
      <Button
        size="small"
        icon="pi pi-arrow-left"
        label="Revenir à l'accueil"
        text
        onClick={() => router.back()}
        className="hidden md:flex"
      />
    </div>
  );
};
