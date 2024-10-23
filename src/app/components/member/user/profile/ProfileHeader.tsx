import React from 'react';
import dayjs from 'dayjs';
import { Avatar } from 'primereact/avatar';
import { User as PrismaUser } from '@prisma/client';

interface ProfileHeaderProps {
  user: PrismaUser | null;
  defaultProfileImage: string;
  isMobile: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  defaultProfileImage,
  isMobile,
}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
      <div className="flex flex-row gap-4 items-start md:items-center  w-full">
        <Avatar
          image={user?.profile || defaultProfileImage}
          shape="circle"
          size="xlarge"
          className="cursor-pointer"
        />
        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-col gap-1">
            <p className="text-xl md:text-2xl text-gray-900 font-semibold">
              {user?.lastName} {user?.firstName}
            </p>
            <p className="text-gray-500 text-sm font-light">{user?.email}</p>
          </div>
          {isMobile && (
            <div className="flex flex-col gap-1 w-full  text-start md:text-right">
              <p className="text-xl text-gray-900 font-normal">
                {dayjs(user?.createdAt).format('DD/MM/YYYY')}
              </p>
              <p className="text-sm text-gray-500 font-semibold">Inscription</p>
            </div>
          )}
        </div>
      </div>
      {!isMobile && (
        <div className="flex flex-col gap-1 w-full  text-start md:text-right">
          <p className="text-xl text-gray-900 font-normal">
            {dayjs(user?.createdAt).format('DD/MM/YYYY')}
          </p>
          <p className="text-sm text-gray-500 font-semibold">Inscription</p>
        </div>
      )}
    </div>
  );
};
