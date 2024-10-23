'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useWindow } from '@/features/app/hooks/useWindow';
import MemberPage from '@/features/app/pages/member/MemberPage';

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
    >
      <Button
        size="small"
        onClick={async () => await signOut({ callbackUrl: '/signin' })}
        label="logout"
      />
    </MemberPage>
  );
};

export default HomePage;
