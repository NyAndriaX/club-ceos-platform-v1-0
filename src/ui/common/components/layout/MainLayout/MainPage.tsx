import React, { PropsWithChildren } from 'react';

export const MainPage: React.FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col mx-auto gap-4 lg:px-8 lg:py-4">
      <h1 className="text-lg md:text-2xl font-bold w-[98vw] lg:w-[70vw]">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
};
