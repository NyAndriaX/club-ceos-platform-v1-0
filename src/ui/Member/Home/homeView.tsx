'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { MemberPage } from '@/ui/common/components/layout/MemberLayout/MemberPage';

const HomeView = () => {
  const router = useRouter();
  return (
    <MemberPage
      title={
        <div className="flex flex-row gap-4 items-center justify-between">
          <h1>Bienvenue !</h1>
          <Button
            onClick={() => router.push('/member/topics/new')}
            label="Créer un nouveau sujet"
            outlined
          />
        </div>
      }
    ></MemberPage>
  );
};

export default HomeView;
