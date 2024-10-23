'use client';

import React, { useEffect, useState } from 'react';
import MemberPage from '../../MemberPage';
import { TopicOutput } from '@/typings/topic';
import { useWindow } from '@/features/app/hooks/useWindow';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TopicDraftsPage: React.FC = () => {
  const router = useRouter();
  const { isMobile } = useWindow();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isLoadingToFetchTopicsAsDrafts, setIsLoadingToFetchTopicsAsDrafts] =
    useState<boolean>(false);
  const [topicsAsDrafts, setTopicsAsDrafts] = useState<TopicOutput[] | []>([]);

  useEffect(() => {
    const fetchAllTopicsWithStatusDrafts = async () => {
      setIsLoadingToFetchTopicsAsDrafts(true);
      try {
        const response = await fetch(`/api/topic/DRAFT/${userId}`);
        const { topics } = await response.json();
        setTopicsAsDrafts(topics);
      } catch (error) {
        console.error('Erreur lors de la récupération des sujets :', error);
      } finally {
        setIsLoadingToFetchTopicsAsDrafts(false);
      }
    };

    fetchAllTopicsWithStatusDrafts();
  }, [userId]);

  const contentTemplate = (rowData: TopicOutput) => {
    return <div dangerouslySetInnerHTML={{ __html: rowData.content }} />;
  };

  return (
    <MemberPage
      headers={
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <h1>Brouillons</h1>
          <Button
            size="small"
            icon="pi pi-plus"
            rounded={isMobile ? true : false}
            onClick={() => router.push('/member/topic')}
            label={isMobile ? undefined : 'Créer un nouveau sujet'}
            outlined
          />
        </div>
      }
    >
      <div className="w-full">
        <DataTable
          value={topicsAsDrafts}
          loading={isLoadingToFetchTopicsAsDrafts}
        >
          <Column field="title" header="Titre" />
          <Column body={contentTemplate} header="Contenu" />
        </DataTable>
      </div>
    </MemberPage>
  );
};

export default TopicDraftsPage;
