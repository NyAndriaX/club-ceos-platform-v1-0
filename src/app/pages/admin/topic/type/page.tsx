'use client';

import React, { useState, useRef } from 'react';
import AdminPage from '../../AdminPage';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { validate } from '@/app/utils/validation';
import { topicTypeSchema } from '@/app/validators/topic.validator';
import { TopicType } from '@prisma/client';
import { classNames } from 'primereact/utils';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from 'primereact/fileupload';
import { storage } from '@/app/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { InputTextarea } from 'primereact/inputtextarea';

const TopicTypeFormPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showToast = (
    severity: 'success' | 'error',
    summary: string,
    detail: string,
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const filePath = `cover-images/${file.name}-${uuidv4()}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      showToast(
        'error',
        'Erreur de téléversement',
        'Impossible de téléverser le fichier. Veuillez réessayer.',
      );
      return null;
    }
  };

  const onSubmit = async (
    values: Partial<TopicType>,
    resetForm: () => void,
  ) => {
    setIsLoading(true);
    try {
      let coverImageURL: string | null = null;

      if (selectedFile) {
        coverImageURL = await uploadFile(selectedFile);
      }

      const response = await fetch('/api/topic/type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, coverImage: coverImageURL }),
      });

      if (!response.ok)
        throw new Error("Une erreur est survenue lors de l'enregistrement.");

      showToast(
        'success',
        'Succès',
        'Le type de thématique a été enregistré avec succès.',
      );
      resetForm();
    } catch (error) {
      showToast(
        'error',
        'Erreur',
        "Impossible d'enregistrer le type de thématique. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toast ref={toast} />
      <AdminPage>
        <div className="flex flex-col gap-4 md:max-w-2xl w-full rounded-md">
          <h2 className="text-xl text-gray-900 font-semibold md:text-2xl">
            Créer un nouveau type de thématique
          </h2>
          <Formik
            initialValues={{ name: '', coverImage: '', description: '' }}
            validate={validate(topicTypeSchema)}
            onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form className="flex flex-col gap-4">
                <div className="p-field">
                  <label htmlFor="name" className="font-medium">
                    Nom du type de thématique{' '}
                  </label>
                  <Field name="name">
                    {({ field }: { field: any }) => (
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Ex: Technologie, Santé, Éducation"
                        className={classNames(
                          'p-inputtext p-component w-full',
                          {
                            'border border-red-500':
                              touched.name && errors.name,
                          },
                        )}
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="p-error"
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="description" className="font-medium">
                    Description
                  </label>
                  <Field name="description">
                    {({ field }: { field: any }) => (
                      <InputTextarea
                        id="description"
                        {...field}
                        rows={5}
                        placeholder="Décrivez le type de thématique ici..."
                        className={classNames(
                          'p-inputtext p-component w-full',
                          {
                            'border border-red-500':
                              touched.description && errors.description,
                          },
                        )}
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="p-error"
                  />
                </div>

                <div className="p-field">
                  <label htmlFor="coverImage" className="font-medium">
                    Image de couverture par défaut{' '}
                  </label>
                  <div
                    className={`flex flex-row gap-4 items-center border ${
                      touched.coverImage && errors.coverImage
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md bg-white p-2`}
                  >
                    <FileUpload
                      mode="basic"
                      chooseLabel="Choisir un fichier"
                      accept="image/*"
                      maxFileSize={1000000}
                      auto
                      onSelect={e => {
                        const file = e.files[0];
                        setSelectedFile(file);
                        setFieldValue('coverImage', file.name);
                      }}
                      disabled={isLoading}
                      className="w-auto text-xs p-1"
                    />

                    <span className="text-gray-500 text-sm w-44 line-clamp-2">
                      {selectedFile
                        ? selectedFile.name
                        : 'Aucun fichier sélectionné'}
                    </span>
                  </div>
                  <ErrorMessage
                    name="coverImage"
                    component="div"
                    className="p-error"
                  />
                </div>

                <div className="flex flex-row items-center justify-start mt-4 gap-4 w-full">
                  <Button
                    size="small"
                    type="button"
                    icon="pi pi-times"
                    outlined
                    label="Annuler"
                    severity="danger"
                    disabled={isLoading}
                    onClick={() => console.log('Annuler')}
                    tooltip="Annulez le processus de création."
                  />
                  <Button
                    size="small"
                    type="submit"
                    icon="pi pi-check"
                    loading={isLoading}
                    disabled={isLoading}
                    label="Enregistrer"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </AdminPage>
    </>
  );
};

export default TopicTypeFormPage;
