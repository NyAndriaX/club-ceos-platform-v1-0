'use client';

import React, { useEffect, useState, useCallback } from 'react';
import MemberPage from '../../MemberPage';
import { Card } from 'primereact/card';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Checkbox } from 'primereact/checkbox';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

const MembersListPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<{
    haveBio: boolean;
    globalFilter: string;
  }>({
    globalFilter: '',
    haveBio: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Partial<User>[] | []>([]);
  const [count, setCount] = useState<number>(0);

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs.');
        }

        const { users } = await response.json();

        setUsers(users);
        setCount(users.length);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllUsers();
  }, []);

  const handleCardClick = (user: Partial<User>) => {
    router.push(`/member/users/profil?nom=${user.firstName}&userId=${user.id}`);
  };

  const filteredUsers = useCallback(() => {
    return users.filter(user => {
      const nameMatch = `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(filters.globalFilter.toLowerCase());

      const haveBioMatch = filters.haveBio ? user.bio !== null : true;

      return nameMatch && haveBioMatch;
    });
  }, [filters, users]);
  return (
    <MemberPage headers="Annuaire des membres">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-content-end">
          <IconField iconPosition="left" className="w-full">
            <InputIcon className="pi pi-search " />
            <InputText
              placeholder={`Rechercher parmis les ${count} membres de la communauté`}
              className="p-inputtext w-full"
              value={filters.globalFilter}
              onChange={e =>
                setFilters(prev => ({
                  ...prev,
                  globalFilter: e.target.value,
                }))
              }
              style={{ paddingLeft: '2rem' }}
            />
          </IconField>
        </div>
        {isLoading && (
          <div className="flex flex-row items-center justify-center w-full">
            <ProgressSpinner
              style={{ width: '30px', height: '30px' }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        )}
        {error && <span className="text-red-500">{error}</span>}
        {!isLoading && !error && users && (
          <div className="flex flex-col gap-4">
            <div className="flex align-items-center">
              <Checkbox
                inputId="haveBio"
                name="haveBio"
                checked={filters.haveBio}
                onChange={() =>
                  setFilters(prev => ({ ...prev, haveBio: !filters.haveBio }))
                }
              />
              <label htmlFor="haveBio" className="ml-2">
                Membres avec une biographie
              </label>
            </div>
            {filteredUsers().length <= 0 ? (
              <div className="w-full text-center text-sm text-gray-500">
                Aucun membre ne correspond à vos critères de recherche. Essayez
                d&apos;ajuster les filtres ou de rechercher un autre nom.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {filteredUsers().map((user, index: number) => (
                  <Card
                    key={index}
                    title={
                      <div className="flex flex-row items-center justify-between">
                        <Avatar
                          image={user.profile ?? defaultProfileImage}
                          shape="circle"
                          size="xlarge"
                          className="cursor-pointer"
                        />
                      </div>
                    }
                    footer={
                      <div className="flex flex-row gap-4">
                        {user.linkedInUrl && (
                          <span className="pi pi-linkedin text-blue-900"></span>
                        )}

                        {user.companyWebsite && (
                          <span className="pi pi-globe text-blue-900"></span>
                        )}
                      </div>
                    }
                    className="w-full cursor-pointer shadow-sm bg-white hover:bg-gray-200"
                    onClick={() => handleCardClick(user)}
                  >
                    <div className="flex flex-col gap-2 ">
                      <h2 className="text-gray-900 text-base font-bold">
                        {user.lastName} {user.firstName}
                      </h2>
                      <h3 className="text-gray-500 text-sm font-light">
                        {user.jobTitle}
                      </h3>
                      <p className="text-gray-900 text-sm font-extralight line-clamp-3">
                        {user.bio}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MemberPage>
  );
};
export default MembersListPage;
