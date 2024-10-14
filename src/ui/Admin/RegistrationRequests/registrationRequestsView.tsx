'use client';

import React from 'react';
import { AdminPage } from '@/ui/common/components/layout/AdminLayout/AdminPage';
import { ListApprovedUser } from './components/ListApprovedUser';
import { ListUsersAwaitingApproval } from './components/ListUsersAwaitingApproval';

export function RegistrationRequestsView() {
  return (
    <AdminPage title="Listes des demandes d'inscription">
      <ListUsersAwaitingApproval />
      <ListApprovedUser />
    </AdminPage>
  );
}
