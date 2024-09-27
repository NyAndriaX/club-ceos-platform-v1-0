"use client";

import React from "react";
import { Avatar } from "primereact/avatar";
import { useSession } from "next-auth/react";
import EditForm from "./components/editForm";
import { UserOutput } from "@/typings";

const EditView = () => {
  const { data: session } = useSession();

  const defaultProfileImage =
    "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png";

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex flex-col gap-8 w-1/2 p-4">
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <h2 className="text-2xl font-semibold text-center">Mon compte</h2>
          <Avatar
            image={session?.user?.profile ?? defaultProfileImage}
            shape="circle"
            size="large"
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
