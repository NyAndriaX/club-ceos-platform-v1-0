'use client';

import React from 'react';
import AdminPage from '../AdminPage';
import { ListApprovedUser } from '@/app/components/admin/registration-requests/ListApprovedUser';
import { ListUsersAwaitingApproval } from '@/app/components/admin/registration-requests/ListUsersAwaitingApproval';

const RegistrationRequestsPage: React.FC = () => {
  return (
    <AdminPage headers="Listes des demandes d'inscription">
      <div className="flex flex-col gap-4 w-full">
        <ListUsersAwaitingApproval />
        <ListApprovedUser />
      </div>
    </AdminPage>
  );
};

export default RegistrationRequestsPage;
