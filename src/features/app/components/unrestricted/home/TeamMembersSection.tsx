import React from 'react';
import { Button } from 'primereact/button';
import { AnimatedMembersList } from './AnimatedMembersList';

export const TeamMembersSection: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-4 w-full gap-8 md:gap-4">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <h2 className="text-xl font-bold tracking-tight text-blue-900 sm:text-2xl">
          Nos membres
        </h2>
        <h3 className="text-sm text-center md:text-start text-gray-500">
          Rejoins notre collectiif grandissant de{' '}
          <span className="text-fuchsia-500">+100</span> Entrepreneur(e)s
          Bootstrap
        </h3>
        <Button
          size="small"
          label="Nous rejoindre"
          outlined
          className="w-fit"
        />
      </div>
      <div className="overflow-hidden px-4">
        <AnimatedMembersList />
      </div>
    </section>
  );
};
