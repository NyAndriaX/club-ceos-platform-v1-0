"use client";

import React, { useEffect, useState } from "react";
import { UserOutput } from "@/typings";
import { useSearchParams } from "next/navigation";
import { Avatar } from "primereact/avatar";
import dayjs from "dayjs";

export const ProfilView = () => {
  const [user, setUser] = useState<Partial<UserOutput> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const search = useSearchParams();
  const userId = search.get("userId");

  useEffect(() => {
    async function fetchUserById() {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'utilisateur.");
        }

        const { user } = await response.json();
        setUser(user);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserById();
    } else {
      setError("Aucun identifiant d'utilisateur fourni.");
      setLoading(false);
    }
  }, [userId]);

  const defaultProfileImage =
    "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png";

  return (
    <main className="flex flex-row justify-center">
      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && user && (
        <div className="flex flex-col gap-16 w-2/3 p-4">
          <div className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-8 items-center">
              <Avatar
                image={user.profile ?? defaultProfileImage}
                shape="circle"
                size="xlarge"
                className="cursor-pointer"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{user.lastName}</h2>
                <p className="text-gray-500 font-light text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-light">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </h2>
              <p className="text-gray-500 font-semibold">Inscription</p>
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-gray-500 font-semibold">A propos</h2>
              <p className="text-gray-900 font-light">
                {user.bio === "" || user.bio === null
                  ? "Aucun bio n'est ecrit !"
                  : user.bio}
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-md">
              <div className="flex flex-col">
                <h2 className="text-gray-500 font-semibold">Poste occupé</h2>
                <p className="text-gray-900 font-light">{user.jobTitle}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-gray-500 font-semibold">Entreprise</h2>
                <p className="text-gray-900 font-light">{user.companyName}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-gray-500 font-semibold">Site web</h2>
                <p className="text-gray-900 font-light">
                  {user.companyWebsite}
                </p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-gray-500 font-semibold">Profil Linkedin</h2>
                <p className="text-gray-900 font-light">{user.linkedInUrl}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
