"use client";

import React from "react";
import { Button } from "primereact/button";
import { MemberPage } from "@/ui/common/components/layout/MemberLayout/MemberPage";

export const DraftsView = () => {
  return (
    <MemberPage
      title={
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <h1>Brouillons</h1>
          <Button label="Créer un nouveau sujet" />
        </div>
      }
    >
      DraftsView
    </MemberPage>
  );
};
