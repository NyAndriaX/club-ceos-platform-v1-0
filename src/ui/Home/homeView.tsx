'use client';

import React from 'react';
import { TeamMembers } from './sections/TeamMembers';
import { Benefits } from './sections/Benefits';
import { Testimonials } from './sections/Testimonials';

const HomeView: React.FC = () => {
  return (
    <main className="flex flex-col gap-24 items-start">
      <TeamMembers />
      <Benefits />
      <Testimonials />
    </main>
  );
};
export default HomeView;
