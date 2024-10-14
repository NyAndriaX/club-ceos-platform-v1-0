'use client';

import React from 'react';
import NewThematicForm from './components/newThematicForm';
import { AdminPage } from '@/ui/common/components/layout/AdminLayout/AdminPage';

export const NewThematicView = () => {
  return (
    <AdminPage title="Créer un nouveau thématique" className="mx-auto w-2/3">
      <NewThematicForm />
    </AdminPage>
  );
};
