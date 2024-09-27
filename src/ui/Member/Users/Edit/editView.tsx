"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { useSession } from "next-auth/react";
import EditForm from "./components/editForm";
import { UserOutput } from "@/typings";

const EditView = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const defaultProfileImage =
    "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png";

  const handleAvatarClick = () => {
    const nom = session?.user?.firstName ?? "defaultName";
    const userId = session?.user?.id;
    router.push(`/member/users/profil?nom=${nom}&userId=${userId}`);
  };

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex flex-col gap-8 w-1/2 p-4">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <h2 className="text-2xl font-semibold text-center">Mon compte</h2>
          <Avatar
            image={session?.user?.profile ?? defaultProfileImage}
            shape="circle"
            size="large"
            className="cursor-pointer"
            onClick={handleAvatarClick}
          />
        </div>

        {!session ? (
          <div>Chargement...</div>
        ) : (
          <EditForm user={session?.user as Partial<UserOutput>} />
        )}
      </div>
    </main>
  );
};

export default EditView;
