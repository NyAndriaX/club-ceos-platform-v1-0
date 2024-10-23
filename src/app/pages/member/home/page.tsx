'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useWindow } from '@/app/hooks/useWindow';
import MemberPage from '@/app/pages/member/MemberPage';

const HomePage = () => {
  const router = useRouter();
  const { isDesktop } = useWindow();

  return (
    <MemberPage
      headers={
        <div className="flex flex-row gap-4 items-center justify-between">
          <h1>Bienvenue !</h1>
          {isDesktop && (
            <Button
              size="small"
              onClick={() => router.push('/member/topics/new')}
              label="Créer un nouveau sujet"
              outlined
            />
          )}
        </div>
      }
    ></MemberPage>
  );
};

export default HomePage;
