'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { v4 } from 'uuid';
import dynamic from 'next/dynamic';
import MemberPage from '../MemberPage';
import { Topic } from '@prisma/client';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { storage } from '@/app/firebase/firebase';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { TopicStatus, Theme, TopicType } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { topicSchema } from '@/app/validators/topic.validator';
import { validate } from '@/app/utils/validation';
import { useUserSession } from '@/app/hooks/useUserSessionAuth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const TopicFormPage: React.FC = () => {
  const search = useSearchParams();
  const toastRef = useRef<Toast>(null);
  const { session } = useUserSession();
  const topicId = search.get('topicId');

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFetching, setIsFetching] = useState({
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
  const [isPublishingTopic, setIsPublishingTopic] = useState(false);

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
        const apiUrl = topic
          ? `/api/topic/update/${topicId}`
          : `/api/topic/${status}/${userId}`;

        const response = await fetch(apiUrl, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formValues, coverImage: storageRef }),
        });

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
          <h2 className="text-xl font-semibold md:text-2xl">
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
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validate={validate(topicSchema)}
              onSubmit={async (formValues, { setSubmitting, resetForm }) => {
                await handleTopicSave(formValues, 'PUBLISHED');
                setSubmitting(false);
                resetForm();
              }}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form className="flex flex-col gap-8 items-start w-full">
                  <div className="p-field">
                    <label htmlFor="type">
                      Type de sujet <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      {isFetching.topicTypes ? (
                        <ProgressSpinner
                          style={{ width: '20px', height: '20px' }}
                          strokeWidth="8"
                          fill="var(--surface-ground)"
                          animationDuration=".5s"
                        />
                      ) : (
                        availableTopicTypes.map(topicType => (
                          <div
                            key={topicType.id}
                            className={`cursor-pointer text-sm font-semibold px-2 py-1 rounded-lg shadow-sm ${
                              values.topicTypeId === topicType.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-500 '
                            }`}
                            onClick={() =>
                              setFieldValue('topicTypeId', topicType.id)
                            }
                          >
                            {topicType.name}
                          </div>
                        ))
                      )}
                      <ErrorMessage
                        name="topicTypeId"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>

                  <div className="p-field w-full">
                    <label htmlFor="title">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="title"
                      as={InputText}
                      id="title"
                      placeholder="Titre du sujet"
                      className={`p-inputtext p-component ${
                        touched.title && errors.title
                          ? 'border border-red-500'
                          : ''
                      }`}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="p-field w-full">
                    <label htmlFor="content">
                      Contenu <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                      value={values.content}
                      onChange={content => setFieldValue('content', content)}
                      className={`bg-white ${touched.content && errors.content && 'border border-red-500 rounded-md'}`}
                      modules={{ toolbar: toolbarOptions }}
                    />
                    <ErrorMessage
                      name="content"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="p-field w-full">
                    <label htmlFor="theme">Thème</label>
                    <Dropdown
                      value={selectedTheme}
                      options={availableThemes}
                      onChange={e => {
                        console.log(e.value);
                        setSelectedTheme(e.value);
                        setFieldValue('themeId', e.value.id);
                      }}
                      placeholder="Sélectionner un thème"
                      optionLabel="title"
                      className={`w-full ${
                        touched.themeId && errors.themeId
                          ? 'border border-red-500'
                          : ''
                      }`}
                    />
                    <ErrorMessage
                      name="themeId"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="p-field w-full">
                    <label htmlFor="file">
                      Image de couverture{' '}
                      <span className="text-gray-500">(facultative)</span>
                    </label>
                    <div className="flex flex-row gap-4 items-center border border-gray-300 rounded-md bg-white p-2">
                      <FileUpload
                        mode="basic"
                        chooseLabel="Choisir un fichier"
                        auto
                        uploadHandler={({ files }) => setSelectFile(files[0])}
                        accept="image/*"
                        className="w-auto text-xs p-1"
                      />
                      <span className="text-gray-500 text-sm w-44 line-clamp-2">
                        {selectFile
                          ? selectFile.name
                          : 'Aucun fichier sélectionné'}
                      </span>
                    </div>

                    <ErrorMessage
                      name="coverImage"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <Button
                      type="button"
                      size="small"
                      label="Enregistrer le brouillon"
                      icon="pi pi-save"
                      className="p-button-secondary"
                      disabled={isSavingDraft}
                      loading={isSavingDraft}
                      onClick={() => handleTopicSave(values, 'DRAFT')}
                    />
                    <Button
                      type="submit"
                      size="small"
                      label="Publier"
                      icon="pi pi-check"
                      className="p-button-success"
                      disabled={isPublishingTopic}
                      loading={isPublishingTopic}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </MemberPage>
    </>
  );
};

export default TopicFormPage;
