"use client";

import React from "react";
import { Button } from "primereact/button";
import { MemberPage } from "@/ui/common/components/layout/MemberLayout/MemberPage";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
            <div className="flex-col">

                <DataTable tableStyle={{ maxWidth: '50rem' }}>
                    <Column field="title" header="title">titre</Column>
                    <Column field="description" header="description">description</Column>
                </DataTable>
            </div>
        </MemberPage>
    );
};
