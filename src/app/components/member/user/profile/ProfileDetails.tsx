import React from 'react';
import { User as PrismaUser } from '@prisma/client';

interface ProfileDetailsProps {
  user: PrismaUser | null;
}

const renderProfileDetail = (label: string, value: string | undefined) => (
  <div>
    <p className="text-gray-900 text-sm font-semibold">{label}</p>
    <p className="text-gray-500 text-xs">{value}</p>
  </div>
);

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => (
  <div className="flex flex-col gap-4 bg-white w-full md:w-[300px] p-4 md:ml-0 rounded-md shadow-sm">
    {renderProfileDetail('Poste occupé', user?.jobTitle)}
    {renderProfileDetail('Entreprise', user?.companyName)}
    {renderProfileDetail('Site web', user?.companyWebsite)}
    {renderProfileDetail('Profil LinkedIn', user?.linkedInUrl)}
  </div>
);
