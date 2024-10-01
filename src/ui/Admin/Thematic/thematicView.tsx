"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeOutput } from "@/typings/theme";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { AdminPage } from "@/ui/common/components/layout/AdminLayout/AdminPage";

export const ThematicView = () => {
  const router = useRouter();
  const [themes, setThemes] = useState<ThemeOutput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllThematics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/theme");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des thèmes");
        }
        const { themes } = await response.json();
        setThemes(themes);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllThematics();
  }, []);

  return (
    <AdminPage
      title={
        <div className="flex flex-row gap-4 items-center w-full justify-between">
          <h1>Thématique</h1>
          <Button
            size="small"
            onClick={() => router.push("/admin/thematic/new")}
          >
            Créer un nouveau thématique
          </Button>
        </div>
      }
      subtitle="Non eiusmod do excepteur commodo minim amet enim. Cupidatat ipsum eu pariatur ipsum sint tempor dolor eiusmod qui nostrud in aliqua non. Nisi incididunt qui quis adipisicing labore amet anim."
    >
      <main className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center justify-between">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              type="text"
              placeholder="Rechercher"
              className="md:p-inputtext-md lg:p-inputtext-lg"
              aria-label="Rechercher une thématique"
            />
          </IconField>
          <div className="flex flex-row gap-1 p-1 items-center border border-gray-200 bg-white rounded-md">
            <Button label="Populaire" text />
            <Button label="Nom" text />
            <Button label="Nouveau" text />
          </div>
        </div>
        {isLoading ? (
          <p>Chargement des thématiques...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-row gap-4">
            {themes.map((theme) => (
              <Card
                title={
                  <h3 className="text-sm font-semibold lowercase px-2 py-1 bg-gray-200 rounded-md w-fit">
                    {theme.title}
                  </h3>
                }
                footer={
                  <div className="flex flex-col text-sm font-light w-fit">
                    <span>465465</span>
                    <span>sujets</span>
                  </div>
                }
                key={theme.id}
                className="w-[350px] border border-gray-300"
              >
                <p className="text-sm line-clamp-3">{theme.description}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </AdminPage>
  );
};