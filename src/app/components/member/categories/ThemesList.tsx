import React from 'react';
import { Badge } from 'primereact/badge';
import { Theme } from '@prisma/client';
import { ProgressSpinner } from 'primereact/progressspinner';

interface TopicTypesListProps {
  isFetching: {
    themes: boolean;
    topicTypes: boolean;
  };
  themes: Theme[] | [];
}

const ThemesList: React.FC<TopicTypesListProps> = ({ isFetching, themes }) => {
  const renderThemeslist = (theme: Theme) => (
    <div
      key={theme.id}
      className="flex flex-row items-center justify-between gap-2 cursor-pointer border border-gray-200 shadow-sm bg-white rounded-md p-4"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-row gap-2 items-center">
          <Badge />
          <h2 className="text-sm text-gray-900 font-medium">{theme.title}</h2>
        </div>
        <p className="text-xs text-gray-500 font-normal line-clamp-2">
          {theme.description}
        </p>
      </div>
      <span className="pi pi-angle-right text-gray-500"></span>
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
        Espaces
      </h1>
      {themes && themes.length > 0 ? (
        themes.map(theme => renderThemeslist(theme))
      ) : (
        <p className="w-full text-gray-500 text-sm text-center">
          Aucun type de sujet disponible.
        </p>
      )}
    </div>
  );
};
export default ThemesList;
