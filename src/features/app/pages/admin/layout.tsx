'use client';

import React from 'react';
import { useWindow } from '../../hooks/useWindow';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '../../components/admin/Navbar';
import { MobileNavbar } from '../../components/admin/MobileNavbar';
import { useUserSession } from '@/features/app/hooks/useUserSessionAuth';
import { ProgressSpinner } from 'primereact/progressspinner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isMobile } = useWindow();
  const { session, loading } = useUserSession();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <ProgressSpinner
          style={{ width: '30px', height: '30px' }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <div
        style={{ zoom: '0.9' }}
        className={`flex ${!isMobile ? 'flex-row' : 'flex-col-reverse'} gap-4 w-full h-full overflow-auto`}
      >
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className={`w-full h-full ${isMobile && 'pb-36'}`}>{children}</div>
      </div>
    </SessionProvider>
  );
};

export default Layout;
