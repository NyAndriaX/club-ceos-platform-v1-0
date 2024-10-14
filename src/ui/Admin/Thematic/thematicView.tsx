'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeOutput } from '@/typings/theme';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { AdminPage } from '@/ui/common/components/layout/AdminLayout/AdminPage';
import { ProgressSpinner } from 'primereact/progressspinner';

export const ThematicView = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<{ globalFilters: string }>({
    globalFilters: '',
  });
  const [themes, setThemes] = useState<ThemeOutput[] | []>([]);
  const [isFetchingThemes, setIsFetchingThemes] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllThematics = async () => {
      setIsFetchingThemes(true);
      setError(null);
      try {
        const response = await fetch('/api/theme');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des thèmes');
        }
        const { themes } = await response.json();
        setThemes(themes);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsFetchingThemes(false);
      }
    };

    fetchAllThematics();
  }, []);

  const filteredThemes = useCallback(() => {
    return themes.filter(theme => {
      const themeMatch = theme.title
        .toLowerCase()
        .includes(filters.globalFilters.toLowerCase());

      return themeMatch;
    });
  }, [filters, themes]);

  return (
    <AdminPage
      title={
        <div className="flex flex-row gap-4 items-center w-full justify-between">
          <h1>Thématique</h1>
          <Button outlined onClick={() => router.push('/admin/thematic/new')}>
            Créer un nouveau thématique
          </Button>
        </div>
      }
    >
      <main className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center justify-between">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              type="text"
              placeholder="Rechercher"
              value={filters.globalFilters}
              onChange={e => {
                setFilters(prevFilters => ({
                  ...prevFilters,
                  globalFilters: e.target.value,
                }));
              }}
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
        {isFetchingThemes ? (
          <div className="flex flex-row items-center justify-center w-full">
            <ProgressSpinner
              style={{ width: '30px', height: '30px' }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-row gap-4 w-full">
            {filteredThemes().length <= 0 ? (
              <div className="text-center text-gray-500 w-full">
                Aucun thématique ne correspond à vos critères de recherche.
                Essayez d&apos;ajuster les filtres ou de rechercher un autre
                nom.
              </div>
            ) : (
              filteredThemes().map(theme => (
                <Card
                  title={
                    <h3 className="text-sm font-semibold line-clamp-2 lowercase px-2 py-1 bg-gray-200 rounded-md w-fit">
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
              ))
            )}
          </div>
        )}
      </main>
    </AdminPage>
  );
};
