'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../AdminPage';
import { useRouter } from 'next/navigation';
import { Theme } from '@prisma/client';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useWindow } from '@/features/app/hooks/useWindow';

const ThematicListPage: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useWindow();
  const [filters, setFilters] = useState<{ globalFilters: string }>({
    globalFilters: '',
  });
  const [themes, setThemes] = useState<Partial<Theme>[] | []>([]);
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
      const themeMatch =
        theme.title ??
        ''.toLowerCase().includes(filters.globalFilters.toLowerCase());

      return themeMatch;
    });
  }, [filters, themes]);
  return (
    <AdminPage
      headers={
        <div className="flex flex-row gap-4 items-center w-full justify-between">
          <h1>Liste des thématiques</h1>
          <Button
            size="small"
            icon="pi pi-plus"
            outlined
            rounded={!isMobile ? false : true}
            label={!isMobile ? 'Créer un nouveau thématique' : undefined}
            onClick={() => router.push('/admin/thematic/new')}
            className="w-fit h-fit"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full">
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
              className="p-inputtext"
              style={{ paddingLeft: '2rem' }}
              aria-label="Rechercher une thématique"
            />
          </IconField>
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
          <>
            {filteredThemes().length <= 0 ? (
              <div className="text-sm text-center text-gray-500 w-full">
                Aucun thématique ne correspond à vos critères de recherche.
                Essayez d&apos;ajuster les filtres ou de rechercher un autre
                nom.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {filteredThemes().map(theme => (
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
                    className="w-full shadow-sm"
                  >
                    <p className="text-sm line-clamp-3">{theme.description}</p>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminPage>
  );
};

export default ThematicListPage;
