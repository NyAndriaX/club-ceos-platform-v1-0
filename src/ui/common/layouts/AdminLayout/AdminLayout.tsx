'use client';

import React from 'react';
import { NavBar } from '../../components/layout/AdminLayout/NavBar';
import './AdminLayout.modules.css';

type Props = {
  children: React.ReactNode;
};

export const AdminLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row h-full">
        <NavBar />
        <div className="flex flex-col lg:px-8 py-4 flex-1 h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
