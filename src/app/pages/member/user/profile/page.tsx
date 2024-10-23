'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MemberPage from '../../MemberPage';
import { Button } from 'primereact/button';
import { ActivitySection } from '@/app/components/member/user/profile/ActivitySection';
import { ProfileHeader } from '@/app/components/member/user/profile/ProfileHeader';
import { ProfileContent } from '@/app/components/member/user/profile/ProfileContent';
import { useWindow } from '@/app/hooks/useWindow';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TopicType, Topic, Theme, User } from '@prisma/client';

const ProfilePage = () => {
  const router = useRouter();
  const { isMobile } = useWindow();
  const search = useSearchParams();
  const userId = search.get('userId');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<
    (Topic & { type: TopicType; theme: Theme })[]
  >([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!userId) {
        setError("Aucun identifiant d'utilisateur fourni.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de l'utilisateur.");
        const { user: userDetails } = await response.json();
        const { topics, ...user } = userDetails;
        setUser(user);
        setTopics(topics);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [userId]);

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <ProgressSpinner
          style={{ width: '30px', height: '30px' }}
          strokeWidth="8"
        />
      </div>
    );
  }

  if (error) {
    return (
      <MemberPage>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center justify-between w-full"
          role="alert"
        >
          <span>{error}</span>
          <Button
            icon="pi pi-refresh"
            label="Réessayer"
            className="p-button-danger"
            size="small"
            text
            onClick={() => router.refresh()}
          />
        </div>
      </MemberPage>
    );
  }

  return (
    <MemberPage>
      <div className="flex flex-col items-center justify-center w-full p-4">
        <div className="flex flex-col gap-4 w-full md:max-w-4xl rounded-md">
          {/* headers */}
          <ProfileHeader
            user={user}
            defaultProfileImage={defaultProfileImage}
            isMobile={isMobile}
          />
          {/* content */}
          <ProfileContent user={user} />

          {/* Activity */}
          <ActivitySection topics={topics} router={router} />
        </div>
      </div>
    </MemberPage>
  );
};

export default ProfilePage;
