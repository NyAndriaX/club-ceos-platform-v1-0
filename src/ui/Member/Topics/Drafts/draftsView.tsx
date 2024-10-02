"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { MemberPage } from "@/ui/common/components/layout/MemberLayout/MemberPage";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const DraftsView = () => {
  const router = useRouter();
  return (
    <MemberPage
      title={
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <h1>Brouillons</h1>
          <Button
            onClick={() => router.push("/member/topics/new")}
            label="Créer un nouveau sujet"
            outlined
          />
        </div>
      }
    >
      <div className="flex-col">
        <DataTable>
          <Column field="title" header="Titre" />
          <Column field="description" header="Contenu" />
        </DataTable>
      </div>
    </MemberPage>
  );
};
