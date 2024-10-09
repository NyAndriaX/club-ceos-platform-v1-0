"use client";

import React from "react";
import { MemberPage } from "@/ui/common/components/layout/MemberLayout/MemberPage";
import NewTopicsForm from "./components/newTopicsForm";

export const NewTopicsView = () => {
    return (
        <MemberPage title="Créer un nouveau sujet" className="max-w-4xl">
            <NewTopicsForm />
        </MemberPage>
    );
};
