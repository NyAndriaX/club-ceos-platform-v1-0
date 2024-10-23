'use client';

import React from 'react';
import AdminPage from '../AdminPage';

const HomePage: React.FC = () => {
  return (
    <AdminPage headers="Bonjours !">
      <div className="w-full">
        <p className="text-sm text-gray-900">
          Bienvenue sur l&apos;application club ceos administrator
        </p>
      </div>
    </AdminPage>
  );
};

export default HomePage;
