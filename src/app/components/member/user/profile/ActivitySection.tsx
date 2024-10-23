import React from 'react';
import { ActivityCard } from './ActivityCard';
import { Topic, TopicType, Theme } from '@prisma/client';

interface ActivitySectionProps {
  topics: (Topic & { type: TopicType; theme: Theme })[];
  router: any;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({
  topics,
  router,
}) => {
  return (
    <div className="flex flex-col gap-4 mt-4 md:mt-0">
      <p className="text-xl md:text-2xl text-gray-900 font-semibold">
        Activité
      </p>
      <div className="flex flex-col gap-4 p-2">
        {topics.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            Aucune activité n&apos;est disponible.
          </p>
        ) : (
          topics.map(async ({ type, theme, ...topic }, index: number) => (
            <ActivityCard
              key={index}
              index={index}
              router={router}
              topic={topic}
              type={type}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  );
};
