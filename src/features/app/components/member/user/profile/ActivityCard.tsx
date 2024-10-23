import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'primereact/tag';
import { Topic, TopicType, Theme } from '@prisma/client';
import { Badge } from 'primereact/badge';

interface ActivityCardProps {
  index: number;
  router: any;
  topic: Topic | null;
  type: TopicType;
  theme: Theme;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  index,
  router,
  topic,
  type,
  theme,
}) => {
  console.log(topic);
  return (
    <div
      key={index}
      className="flex flex-col md:flex-row gap-4 md:gap-16 items-center md:items-start rounded-md overflow-hidden w-full relative cursor-pointer shadow-sm bg-white"
      onClick={() =>
        router.push(
          `/member/topic/details?topicId=${encodeURIComponent(topic?.id ?? '')}`,
        )
      }
    >
      <Image
        src={topic?.coverImage ?? (type.coverImage as string)}
        className="rounded-md object-contain w-72 h-48"
        width={300}
        height={300}
        alt={`Image de ${topic?.title}`}
        unoptimized
        crossOrigin="anonymous"
      />
      <div className="flex flex-col gap-2 md:gap-4 items-start h-full overflow-hidden w-full p-4">
        <div className="flex flex-col gap-1 md:gap-2 h-full w-full">
          <p className="text-lg font-semibold text-gray-900">{topic?.title}</p>
          <div className="flex flex-row items-end w-full">
            <div className="flex-1">
              <span
                className="text-sm text-gray-700 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: topic?.content.replace(/<\/?p>/g, '') ?? '',
                }}
              />
              <Link
                href={`/topic/${topic?.id}`}
                className="underline text-xs text-blue-500 ml-1"
              >
                Lire la suite
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
            <div className="flex flex-row gap-2 items-center">
              <Badge></Badge>
              <span className="line-clamp-2 w-48 text-gray-500">
                {theme?.title}
              </span>
            </div>
            <Tag value={type.name} />
          </div>
        </div>
      </div>
    </div>
  );
};
