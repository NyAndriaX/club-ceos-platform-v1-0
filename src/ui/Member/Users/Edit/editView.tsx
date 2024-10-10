"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { useSession } from "next-auth/react";
import EditForm from "./components/editForm";
import { UserOutput } from "@/typings";
import { MemberPage } from "@/ui/common/components/layout/MemberLayout/MemberPage";
import { ProgressSpinner } from "primereact/progressspinner";

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
        <MemberPage title={
            <div className="flex flex-col gap-4 items-center justify-center">
                <h1>Mon compte</h1>
                <Avatar
                    image={session?.user?.profile ?? defaultProfileImage}
                    shape="circle"
                    size="xlarge"
                    className="cursor-pointer"
                    onClick={handleAvatarClick}
                />
            </div>
        }
            className="w-full max-w-6xl">
            {!session ? (<ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            ) : (
                <EditForm user={session?.user as Partial<UserOutput>} />
            )}
        </MemberPage>
    );
};

export default EditView;
