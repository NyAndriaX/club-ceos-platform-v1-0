import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FileUpload } from 'primereact/fileupload';
import { User } from '@prisma/client';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { userSignupStepThreeSchema } from '@/app/validators/user.validator';
import { validate } from '@/app/utils/validation';
import { storage } from '@/app/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

type Props = {
  formUserRegister: Partial<User>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  setFormUserRegister: React.Dispatch<React.SetStateAction<Partial<User>>>;
};

export function SignupFormStepThree({
  formUserRegister,
  setActiveIndex,
  setFormUserRegister,
}: Props) {
  const toast = useRef<Toast>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<File | null>(null);

  const onSubmit = async (data: Partial<User>) => {
    if (selectFile) {
      setIsLoading(true);
      try {
        const storageRef = ref(
          storage,
          `revenueFiles/${selectFile.name + v4()}`,
        );

        await uploadBytes(storageRef, selectFile);

        const downloadUrl = await getDownloadURL(storageRef);

        data.revenueFileUrl = downloadUrl;

        const newValue = {
          ...formUserRegister,
          ...data,
          paymentUrl: 'https://example.com',
        };

        setFormUserRegister(newValue);

        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newValue),
        });
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi des données.");
        }
        setActiveIndex(prevValue => prevValue + 1);
        window.scrollTo(0, 0);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors du téléchargement du fichier.',
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex flex-col md:flex-row gap-16 items-start justify-between">
        <div className="w-full md:flex-1 flex flex-col gap-4 pr-8">
          <h2 className="text-xl md:text-2xl text-center font-bold text-blue-900">
            Informations sur le chiffre d&apos;affaires
          </h2>
          <p className="text-sm text-gray-500 text-justify">
            Dans cette section, veuillez fournir les informations relatives à
            votre chiffre d&apos;affaires, y compris le montant total généré.
            <span className="text-blue-900">
              Assurez-vous que toutes les informations sont exactes et à jour,
              car elles seront utilisées pour évaluer votre éligibilité à nos
              services.
            </span>
          </p>
        </div>
        <div className="w-full md:flex-1">
          <Formik
            initialValues={{
              revenue: formUserRegister.revenue || 0,
              revenueFile: null,
            }}
            validate={validate(userSignupStepThreeSchema)}
            onSubmit={values => {
              onSubmit(values);
            }}
          >
            {({ errors, setFieldValue, touched }) => (
              <Form className="flex flex-col gap-4">
                <div className="p-field">
                  <label htmlFor="revenue">Chiffre d&apos;affaires (k€) </label>
                  <Field
                    id="revenue"
                    name="revenue"
                    type="number"
                    className={`p-inputtext p-component ${
                      touched.revenue && errors.revenue
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="revenue"
                    component="div"
                    className="p-error"
                  />
                </div>
                <div className="p-field">
                  <h3 className="text-xl font-semibold text-blue-900">
                    Documents justificatifs
                  </h3>
                  <p className="text-sm text-gray-500">
                    Téléchargez les documents nécessaires pour justifier votre
                    chiffre d&apos;affaires.
                  </p>
                  <FileUpload
                    name="revenueFile"
                    chooseLabel="Choisir"
                    cancelLabel="Annuler"
                    accept=".pdf"
                    maxFileSize={1000000}
                    emptyTemplate={
                      <p className="m-0">
                        Glissez-déposez des fichiers ici pour les télécharger.
                      </p>
                    }
                    onSelect={e => {
                      const file = e.files[0];
                      setFieldValue('revenueFile', file);
                      setSelectFile(file);
                      setIsPending(true);
                      setTimeout(() => {
                        setIsPending(false);
                      }, 2000);
                    }}
                    auto={true}
                    disabled={isPending}
                    className={`w-auto text-xs p-1 ${
                      touched.revenueFile && errors.revenueFile
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="revenueFile"
                    component="div"
                    className="p-error"
                  />
                </div>

                <div className="flex flex-row justify-between mt-6">
                  <Button
                    size="small"
                    type="button"
                    label="Retour"
                    outlined
                    disabled={isLoading}
                    onClick={() => setActiveIndex(prevValue => prevValue - 1)}
                  />
                  <Button
                    size="small"
                    type="submit"
                    label="Suivant"
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
