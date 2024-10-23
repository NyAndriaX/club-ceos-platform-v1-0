import React from 'react';
import AdminLayout from '@/features/app/pages/admin/layout';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
