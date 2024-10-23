'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectToHomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/pages/unrestricted/home');
  }, [router]);

  return null;
};

export default RedirectToHomePage;
