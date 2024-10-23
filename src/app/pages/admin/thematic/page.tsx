'use client';

import React, { useState, useRef } from 'react';
import AdminPage from '../AdminPage';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Theme } from '@prisma/client';
import { Button } from 'primereact/button';
import { themeSchema } from '@/app/validators/theme.validator';
import { validate } from '@/app/utils/validation';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

const ThematicFormPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: Partial<Theme>, resetForm: () => void) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Une erreur est survenue lors de l'enregistrement.");

      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Thématique enregistrée avec succès.',
        life: 3000,
      });

      resetForm();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: "Impossible d'enregistrer la thématique. Veuillez réessayer.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AdminPage>
        <div className="flex flex-col gap-4 md:max-w-2xl w-full rounded-md">
          <h2 className="text-xl text-gray-900 font-semibold md:text-2xl">
            {/* {topic ? `Modifier un sujet` : ''} */}
            Créer un nouveau théme
          </h2>
          <Formik
            initialValues={{
              title: '',
              description: '',
            }}
            validate={validate(themeSchema)}
            onSubmit={(values, { resetForm }) => {
              onSubmit(values, resetForm);
            }}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-6">
                <div className="p-field">
                  <label htmlFor="title" className="font-semibold text-lg">
                    Titre
                    <small className="block font-light text-gray-500">
                      Indiquez un titre clair pour la thématique.
                    </small>
                  </label>
                  <Field name="title">
                    {({ field }: any) => (
                      <InputText
                        id="title"
                        {...field}
                        placeholder="Ex : Thématique sur le développement durable"
                        aria-required="true"
                        aria-invalid={touched.title && !!errors.title}
                        className={classNames(
                          'p-inputtext p-component w-full',
                          {
                            'p-invalid': touched.title && errors.title,
                          },
                        )}
                        disabled={isLoading}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="p-error mt-1"
                  />
                </div>

                <div className="p-field">
                  <label
                    htmlFor="description"
                    className="font-semibold text-lg"
                  >
                    Description
                    <small className="block font-light text-gray-500">
                      Fournissez une description détaillée de la thématique.
                    </small>
                  </label>
                  <Field name="description">
                    {({ field }: any) => (
                      <InputTextarea
                        id="description"
                        {...field}
                        rows={5}
                        cols={30}
                        placeholder="Décrivez les principaux aspects de la thématique..."
                        aria-required="true"
                        aria-invalid={
                          touched.description && !!errors.description
                        }
                        className={classNames(
                          'p-inputtext p-component w-full',
                          {
                            'p-invalid':
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
                    className="p-error mt-1"
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

export default ThematicFormPage;
