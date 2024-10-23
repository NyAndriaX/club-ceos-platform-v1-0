import React from 'react';
import { Card } from 'primereact/card';
import { User } from '@prisma/client';

type RegistrationRequestsAddressProps = {
  user: User;
};

export const RegistrationRequestsAddress: React.FC<
  RegistrationRequestsAddressProps
> = ({ user }) => {
  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Titre principal */}
        <h2 className="text-xl font-bold mb-4">
          Détails du Profil et Coordonnées de l&apos;Entreprise
        </h2>

        {/* Informations personnelles */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Informations Personnelles
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Nom :</div>
              <div className="break-words">{user.lastName}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Prénom :</div>
              <div className="break-words">{user.firstName}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Téléphone :</div>
              <div className="break-words">{user.phoneNumber}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">E-mail :</div>
              <div className="break-words">{user.email}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">LinkedIn :</div>
              <div className="break-words">{user.linkedInUrl}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Titre Professionnel :</div>
              <div className="break-words">{user.jobTitle}</div>
            </div>
          </div>
        </section>

        {/* Adresse de résidence */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Adresse de Résidence
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Code Postal :</div>
              <div className="break-words">{user.postCode}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Pays :</div>
              <div className="break-words">{user.country}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">Ville :</div>
              <div className="break-words">{user.city}</div>
            </div>
          </div>
        </section>

        {/* Coordonnées de l'entreprise */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Coordonnées de l&apos;Entreprise
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[50%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Nom de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyName}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[50%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Téléphone de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyPhoneNumber}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[50%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Site Web de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyWebsite}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[50%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Page LinkedIn de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyLinkedInPage}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Code Postal de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyPostCode}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Pays de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyCountry}</div>
            </div>
            <div className="flex-1 min-w-[15rem] max-w-full md:max-w-[33%] bg-gray-100 p-4 rounded border">
              <div className="font-medium text-sm">
                Ville de l&apos;Entreprise :
              </div>
              <div className="break-words">{user.companyCity}</div>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
};
