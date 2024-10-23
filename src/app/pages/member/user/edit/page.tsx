'use client';

import React from 'react';
import MemberPage from '../../MemberPage';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useUserSession } from '@/app/hooks/useUserSessionAuth';
import { EditForm } from '@/app/components/member/user/edit/EditForm';

const EditPage: React.FC = () => {
  const router = useRouter();
  const { session, loading } = useUserSession();

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center h-full w-full">
        <ProgressSpinner
          style={{ width: '30px', height: '30px' }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  return (
    <MemberPage>
      <div className="flex flex-col gap-4 md:max-w-2xl w-full rounded-md">
        <div className="flex flex-col gap-4 items-center justify-center w-full">
          <h2 className="text-2xl font-semibold w-fit">Mon compte</h2>
          <Avatar
            image={session?.user?.profile ?? defaultProfileImage}
            shape="circle"
            size="large"
            className="cursor-pointer"
            onClick={() =>
              router.push(
                `/pages/member/user/profile?nom=${session?.user.firstName}&userId=${session?.user.id}`,
              )
            }
          />
        </div>
        <EditForm user={session!.user} />
      </div>
    </MemberPage>
  );
};

export default EditPage;
