'use client';

import React from 'react';
import { NavBar } from '../../components/layout/MemberLayout/NavBar';
import './MemberLayout.modules.css';

type Props = {
  children: React.ReactNode;
};

export const MemberLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row h-full">
        <NavBar />
        <div className="flex flex-col mx-auto w-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
