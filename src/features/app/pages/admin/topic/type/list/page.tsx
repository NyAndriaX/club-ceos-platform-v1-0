'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWindow } from '@/features/app/hooks/useWindow';
import AdminPage from '../../../AdminPage';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { TopicTypeOutput } from '@/typings/topic';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import { Toast } from 'primereact/toast';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

const TopicTypeListPage: React.FC = () => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { isMobile } = useWindow();
  const [filters, setFilters] = useState<{ globalFilters: string }>({
    globalFilters: '',
  });
  const [topicTypes, setTopicTypes] = useState<TopicTypeOutput[]>([]);
  const [isFetchingTopicTypes, setIsFetchingTopicTypes] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topicTypeToDelete, setTopicTypeToDelete] =
    useState<TopicTypeOutput | null>(null);

  useEffect(() => {
    const fetchAllTopicTypes = async () => {
      setIsFetchingTopicTypes(true);
      setError(null);

      try {
        const response = await fetch('/api/topic/type');
        if (!response.ok)
          throw new Error(
            'Erreur lors de la récupération des types de thématiques.',
          );

        const { topicTypes } = await response.json();
        setTopicTypes(topicTypes);
      } catch (error: any) {
        setError(
          'Impossible de charger les types de thématiques. Veuillez réessayer plus tard.',
        );
      } finally {
        setIsFetchingTopicTypes(false);
      }
    };

    fetchAllTopicTypes();
  }, []);

  const filteredTopicTypes = useCallback(() => {
    return topicTypes.filter(topicType =>
      topicType.name
        .toLowerCase()
        .includes(filters.globalFilters.toLowerCase()),
    );
  }, [filters, topicTypes]);

  const confirmDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    topicType: TopicTypeOutput,
  ) => {
    setTopicTypeToDelete(topicType);
    confirmPopup({
      target: e.currentTarget,
      message: `Êtes-vous sûr de vouloir supprimer le type de thématique "${topicType.name}" ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: deleteTopicType,
      reject: () => setTopicTypeToDelete(null),
    });
  };

  const deleteTopicType = async () => {
    if (!topicTypeToDelete) return;

    try {
      const response = await fetch(`/api/topic/type/${topicTypeToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error('Erreur lors de la suppression du type de thématique.');

      setTopicTypes(prev =>
        prev.filter(type => type.id !== topicTypeToDelete.id),
      );
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: `Type de thématique "${topicTypeToDelete.name}" supprimé avec succès.`,
        life: 3000,
      });
    } catch (error: any) {
      setError(error.message);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: error.message,
      });
    } finally {
      setTopicTypeToDelete(null);
    }
  };

  const renderTopicTypeCard = (topicType: TopicTypeOutput) => {
    return (
      <Card
        key={topicType.id}
        header={
          topicType.coverImage && (
            <Image
              src={topicType.coverImage as string}
              width={200}
              height={200}
              className="object-contain w-80 h-40"
              alt={`Image de ${topicType.name}`}
              unoptimized
            />
          )
        }
        title={<h3 className="text-base">{topicType.name}</h3>}
        className="w-full relative h-fit shadow-sm"
      >
        <div className="flex flex-col gap-2 items-start">
          <p className="text-sm text-gray-500 overflow-hidden overflow-ellipsis line-clamp-3">
            {topicType.description}
          </p>
          <div className="flex flex-row items-center gap-4">
            <Button
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              onClick={e => confirmDelete(e, topicType)}
            />
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              onClick={() =>
                router.push(`/admin/topic/type/edit/${topicType.id}`)
              }
            />
          </div>
        </div>
      </Card>
    );
  };
  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup />
      <AdminPage
        headers={
          <div className="flex flex-row gap-4 items-center w-full justify-between">
            <h1>Liste des types de thématiques</h1>
            <Button
              size="small"
              icon="pi pi-plus"
              outlined
              rounded={!isMobile ? false : true}
              label={
                !isMobile ? 'Créer un nouveau type de thématiques' : undefined
              }
              onClick={() => router.push('/admin/topic/type/new')}
              className="w-fit h-fit"
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4 w-full">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              type="text"
              style={{ paddingLeft: '2rem' }}
              placeholder="Rechercher"
              value={filters.globalFilters}
              onChange={e => setFilters({ globalFilters: e.target.value })}
              className="p-inputtext"
              aria-label="Rechercher une thématique"
            />
          </IconField>

          {isFetchingTopicTypes ? (
            <ProgressSpinner
              style={{ width: '30px', height: '30px' }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {filteredTopicTypes().length <= 0 ? (
                <div className="text-sm text-center text-gray-500 w-full">
                  Aucun type de thématique ne correspond à vos critères de
                  recherche.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {filteredTopicTypes().map(renderTopicTypeCard)}
                </div>
              )}
            </>
          )}
        </div>
      </AdminPage>
    </>
  );
};

export default TopicTypeListPage;
