import React from 'react';
import { TopicType } from '@prisma/client';
import { ProgressSpinner } from 'primereact/progressspinner';

interface TopicTypesListProps {
  isFetching: {
    themes: boolean;
    topicTypes: boolean;
  };
  topicTypes: TopicType[] | [];
}

const TopicTypesList: React.FC<TopicTypesListProps> = ({
  isFetching,
  topicTypes,
}) => {
  const renderTopicTypesList = (topicType: TopicType) => (
    <div
      key={topicType.id}
      className="flex flex-row items-center justify-between cursor-pointer border border-gray-200 shadow-sm bg-white rounded-md p-4"
    >
      <h2 className="text-sm text-gray-900 font-medium">{topicType.name}</h2>
      <span
        className="pi pi-angle-right text-gray-500
"
      ></span>
    </div>
  );

  if (isFetching.topicTypes) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <ProgressSpinner
          style={{ width: '30px', height: '30px' }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl md:text-2xl text-gray-900 font-semibold">
        Types des sujets
      </h1>
      {topicTypes && topicTypes.length > 0 ? (
        topicTypes.map(topicType => renderTopicTypesList(topicType))
      ) : (
        <p className="w-full text-gray-500 text-sm text-center">
          Aucun type de sujet disponible.
        </p>
      )}
    </div>
  );
};

export default TopicTypesList;
