import React from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { useWindow } from '@/features/app/hooks/useWindow';

interface Member {
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export const CardMember: React.FC<{ member: Member }> = ({ member }) => {
  const { isMobile } = useWindow();

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 border border-gray-200 shadow-sm rounded-xl p-4 w-28 md:w-48 bg-white transition-transform hover:shadow-md hover:scale-105">
      <div className="w-16 h-16 md:mb-2">
        <Image
          src={member.profileImage || '/default-profile.jpeg'}
          alt={`${member.firstName} ${member.lastName}`}
          width={isMobile ? 40 : 64}
          height={isMobile ? 40 : 64}
          className="border border-gray-300 rounded-full object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col text-center text-gray-900 text-sm">
        <span className="font-semibold">{member.firstName}</span>
        <span className="font-extralight">{member.lastName}</span>
      </div>
      <Button label="Visiter" size="small" outlined />
    </div>
  );
};
