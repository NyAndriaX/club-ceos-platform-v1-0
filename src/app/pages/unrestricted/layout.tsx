'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useWindow } from '../../hooks/useWindow';
import Footer from '../../components/unrestricted/Footer';
import MobileNavbar from '../../components/unrestricted/MobileNavbar';
import Navbar from '../../components/unrestricted/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const { isMobile } = useWindow();

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {!isMobile ? <Navbar /> : <MobileNavbar />}
      {children}
      {!pathname.includes('/signin') && !pathname.includes('/login') && (
        <Footer />
      )}
    </div>
  );
};

export default Layout;
