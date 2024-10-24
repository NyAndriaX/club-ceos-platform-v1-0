'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { v4 } from 'uuid';
import MemberPage from '../MemberPage';
import { Topic } from '@prisma/client';
import { Toast } from 'primereact/toast';
import { storage } from '@/app/firebase/firebase';
import { TopicStatus, Theme, TopicType } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useUserSession } from '@/app/hooks/useUserSessionAuth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import TopicForm from '@/app/components/member/topic/TopicForm';

const TopicFormPage: React.FC = () => {
  const search = useSearchParams();
  const toastRef = useRef<Toast>(null);
  const { session } = useUserSession();
  const topicId = search.get('topicId');

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<any>({
    topic: false,
    themes: false,
    topicTypes: false,
  });
  const [availableTopicTypes, setAvailableTopicTypes] = useState<TopicType[]>(
    [],
  );
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [isPublishingTopic, setIsPublishingTopic] = useState<boolean>(false);

  const initialValues = {
    title: topic?.title || '',
    content: topic?.content || '',
    topicTypeId: topic?.topicTypeId || undefined,
    themeId: topic?.themeId || null,
    coverImage: topic?.coverImage || '',
  };

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ];

  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (!topicId) return;
      setIsFetching(prev => ({ ...prev, topic: true }));

      try {
        const topicRes = await fetch(`/api/topic/unique/${topicId}`);
        if (!topicRes.ok)
          throw new Error('Erreur lors de la récupération du sujet');
        const { topic } = await topicRes.json();
        setTopic(topic);
        setSelectedTheme(topic.theme as Theme);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du sujet:',
          error,
        );
      } finally {
        setIsFetching(prev => ({ ...prev, topic: false }));
      }
    };
    fetchTopicDetails();
  }, [topicId]);

  useEffect(() => {
    const fetchTopicTypes = async () => {
      setIsFetching(prev => ({ ...prev, topicTypes: true }));
      try {
        const response = await fetch('/api/topic/type');
        if (!response.ok)
          throw new Error(
            'Erreur lors de la récupération des types de thématique',
          );
        const { topicTypes } = await response.json();
        setAvailableTopicTypes(topicTypes);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(prev => ({ ...prev, topicTypes: false }));
      }
    };
    fetchTopicTypes();
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      setIsFetching(prev => ({ ...prev, themes: true }));
      try {
        const response = await fetch('/api/theme');
        if (!response.ok)
          throw new Error('Erreur lors de la récupération des thèmes');
        const { themes } = await response.json();
        setAvailableThemes(themes);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(prev => ({ ...prev, themes: false }));
      }
    };
    fetchThemes();
  }, []);

  const uploadFileCover = async (file: File): Promise<string | null> => {
    const refPath = `topic/cover/${file.name}-${v4()}`;
    const fileRef = ref(storage, refPath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleTopicSave = useCallback(
    async (formValues: typeof initialValues, status: TopicStatus) => {
      const userId = session?.user.id;
      const isDraft = status === 'DRAFT';
      isDraft ? setIsSavingDraft(true) : setIsPublishingTopic(true);

      let storageRef: string | null = null;

      try {
        if (selectFile) {
          storageRef = await uploadFileCover(selectFile);
        }

        const method = topic ? 'PATCH' : 'POST';
        console.log(method);
        const apiUrl = topic
          ? `/api/topic/update/${topicId}`
          : `/api/topic/${status}/${userId}`;

        const response = await fetch(apiUrl, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formValues, coverImage: storageRef }),
        });
        console.log(response);
        if (!response.ok)
          throw new Error("Erreur lors de l'enregistrement du sujet");

        toastRef.current?.show({
          severity: isDraft ? 'info' : 'success',
          summary: isDraft ? 'Brouillon enregistré' : 'Sujet publié',
          detail: isDraft
            ? 'Le brouillon a été enregistré avec succès.'
            : 'Le sujet a été publié avec succès.',
        });
      } catch (error: any) {
        console.error(error);
        toastRef.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: `Une erreur est survenue lors de l'enregistrement du sujet: ${error.message}`,
        });
      } finally {
        isDraft ? setIsSavingDraft(false) : setIsPublishingTopic(false);
      }
    },
    [selectFile, session?.user.id, topic],
  );

  return (
    <>
      <Toast ref={toastRef} />
      <MemberPage>
        <div className="flex flex-col gap-4 md:max-w-2xl w-full rounded-md">
          <h2 className="text-xl text-gray-900 font-semibold md:text-2xl">
            {topic ? `Modifier un sujet` : 'Créer un nouveau sujet'}
          </h2>
          {isFetching.topic ? (
            <div className="flex justify-center items-center h-full w-full">
              <ProgressSpinner
                style={{ width: '30px', height: '30px' }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          ) : (
            <TopicForm
              isSavingDraft={isSavingDraft}
              isPublishingTopic={isPublishingTopic}
              initialValues={initialValues}
              handleTopicSave={handleTopicSave}
              isFetching={isFetching}
              toolbarOptions={toolbarOptions}
              availableThemes={availableThemes}
              availableTopicTypes={availableTopicTypes}
              selectedTheme={selectedTheme}
              selectFile={selectFile}
              setSelectFile={setSelectFile}
              setSelectedTheme={setSelectedTheme}
            />
          )}
        </div>
      </MemberPage>
    </>
  );
};

export default TopicFormPage;
