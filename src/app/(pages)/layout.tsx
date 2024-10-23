import React from 'react';
import MainLayout from '@/features/app/pages/unrestricted/layout';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
