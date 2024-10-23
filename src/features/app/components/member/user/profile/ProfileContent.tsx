import React from 'react';
import { User as PrismaUser } from '@prisma/client';
import { ProfileDetails } from './ProfileDetails';

interface ProfileContentProps {
  user: PrismaUser | null;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  return (
    <div className="flex flex-col w-full md:flex-row justify-between items-start md:p-4 gap-6">
      <div className="flex flex-col gap-2 w-full md:w-2/3">
        <p className="text-lg text-gray-900 font-semibold">À propos</p>
        <p
          className={`text-gray-900  w-full text-sm ${!user?.bio && 'text-center'}`}
        >
          {user?.bio || (
            <span className="text-gray-500">Aucune bio n'est écrite !</span>
          )}
        </p>
      </div>
      <ProfileDetails user={user} />
    </div>
  );
};
