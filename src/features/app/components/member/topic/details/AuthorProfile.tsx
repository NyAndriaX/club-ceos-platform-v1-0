import React from 'react';
import { Avatar } from 'primereact/avatar';
import { User as PrismaUser } from '@prisma/client';

interface AuthorProfileProps {
  author: PrismaUser | null;
  defaultProfileImage: string;
}

export const AuthorProfile: React.FC<AuthorProfileProps> = ({
  author,
  defaultProfileImage,
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center">
        <Avatar
          image={author?.profile ?? defaultProfileImage}
          shape="circle"
          size="xlarge"
          className="md:w-20 w-16"
        />
        <div className="flex flex-col gap-2 items-start">
          <p className="text-base font-semibold text-gray-900">
            {author?.firstName} {author?.lastName}
          </p>
          <p className="text-sm text-gray-500">{author?.jobTitle}</p>
        </div>
      </div>
    </div>
  );
};
