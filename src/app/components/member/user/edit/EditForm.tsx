import React, { useRef, useState } from 'react';
import { User as PrismaUser, Prisma } from '@prisma/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import { storage } from '@/app/firebase/firebase';
import { editUserSchema } from '@/app/validators/user.validator';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { Password } from 'primereact/password';
import { validate } from '@/app/utils/validation';

interface EditFormProps {
  user: PrismaUser;
}

export const EditForm: React.FC<EditFormProps> = ({ user }) => {
  const toast = useRef<Toast>(null);
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [receiveAnEmail, setReceiveAnEmail] = useState<boolean>(false);

  const initialValues = {
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    jobTitle: user?.jobTitle || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    linkedInUrl: user?.linkedInUrl || '',
    companyWebsite: user?.companyWebsite || '',
    profile: user.profile || null,
    bio: user.bio || '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const refPath = `profiles/${file.name}-${v4()}`;
    const fileRef = ref(storage, refPath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const onSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    setIsLoading(true);
    let storageRef: string | null = null;

    try {
      if (selectFile) {
        storageRef = await uploadFile(selectFile);
      }

      const response: Response = await fetch(
        `/api/user/${user?.id as number}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            profile: storageRef,
          }),
        },
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message ?? "Erreur lors de l'envoi des données.");
      }

      const { user: updateUser } = await response.json();
      await update(updateUser);

      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Profil mis à jour avec succès.',
        life: 3000,
      });

      resetForm({
        values: {
          ...values,
          newPassword: '',
          confirmPassword: '',
          currentPassword: '',
        },
      });

      window.scrollTo(0, 0);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la mise à jour du profil.';
      console.error(error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Formik
        initialValues={initialValues}
        validate={validate(editUserSchema)}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4 items-center w-full">
            <div className="flex flex-col md:flex-row gap-4 items-start w-full">
              {['firstName', 'lastName'].map((field, index) => (
                <div className="p-field" key={index}>
                  <label htmlFor={field}>
                    {field === 'firstName' ? 'Prénom' : 'Nom'}
                  </label>
                  <Field
                    id={field}
                    name={field}
                    type="text"
                    className={`p-inputtext p-component ${
                      touched[field] && errors[field]
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="p-error"
                  />
                </div>
              ))}
            </div>

            <div className="p-field">
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                className={`p-inputtext p-component ${
                  touched.email && errors.email ? 'border border-red-500' : ''
                }`}
              />
              <ErrorMessage name="email" component="div" className="p-error" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start w-full">
              {['jobTitle', 'companyName'].map((field, index) => (
                <div className="p-field" key={index}>
                  <label htmlFor={field}>
                    {field === 'jobTitle' ? 'Poste occupé' : 'Entreprise'}
                  </label>
                  <Field
                    id={field}
                    name={field}
                    type="text"
                    className={`p-inputtext p-component ${
                      touched[field] && errors[field]
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="p-error"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start w-full">
              {['companyWebsite', 'linkedInUrl'].map((field, index) => (
                <div className="p-field" key={index}>
                  <label htmlFor={field}>
                    {field === 'companyWebsite'
                      ? 'Site web'
                      : 'Profil Linkedin'}
                  </label>
                  <Field
                    id={field}
                    name={field}
                    type="url"
                    className={`p-inputtext p-component ${
                      touched[field] && errors[field]
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="p-error"
                  />
                </div>
              ))}
            </div>

            <div className="p-field w-full">
              <label htmlFor="bio">Bio</label>
              <Field name="bio">
                {({ field }: any) => (
                  <InputTextarea
                    id="bio"
                    rows={5}
                    cols={30}
                    {...field}
                    className={`p-inputtext p-component w-full ${
                      touched.bio && errors.bio ? 'border border-red-500' : ''
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage name="bio" component="div" className="p-error" />
            </div>

            <div className="flex flex-row justify-center items-center w-full">
              <div className="flex align-items-center">
                <label htmlFor="receiveAnEmail" className="mr-2">
                  Recevoir des notifications par email
                </label>
                <Checkbox
                  inputId="receiveAnEmail"
                  checked={receiveAnEmail}
                  onChange={() => setReceiveAnEmail(prev => !prev)}
                />
              </div>
            </div>

            <div className="p-field">
              <label htmlFor="profilFile">Avatar</label>
              <div className="flex flex-row gap-4 items-center border border-gray-300 rounded-md bg-white p-2">
                <FileUpload
                  mode="basic"
                  chooseLabel="Choisir un fichier"
                  accept="image/*"
                  maxFileSize={1000000}
                  auto
                  className="w-auto text-xs p-1"
                  onSelect={e => setSelectFile(e.files[0])}
                />
                <span className="text-gray-500 text-sm w-44 line-clamp-2">
                  {selectFile ? selectFile.name : 'Aucun fichier sélectionné'}
                </span>
              </div>
            </div>

            <h3 className="text-sm my-2 text-center text-gray-500 font-light w-full">
              Modifier mon mot de passe (laissez ces champs vides si vous ne
              souhaitez pas le modifier)
            </h3>

            <div className="flex flex-col gap-4 items-start w-full">
              {['newPassword', 'confirmPassword'].map((field, index) => (
                <div className="p-field" key={index}>
                  <label htmlFor={field}>
                    {field === 'newPassword'
                      ? 'Nouveau mot de passe'
                      : 'Confirmez votre mot de passe'}
                  </label>
                  <Field name={field}>
                    {({ field }: { field: any }) => (
                      <Password
                        id={field}
                        {...field}
                        feedback={false}
                        inputClassName={`w-full ${
                          touched[field] && errors[field]
                            ? 'border border-red-500'
                            : ''
                        }`}
                        toggleMask
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="p-error"
                  />
                </div>
              ))}
            </div>
            <div className="p-field">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <Field name="currentPassword">
                {({ field }: any) => (
                  <Password
                    id="currentPassword"
                    {...field}
                    feedback={false}
                    toggleMask
                    inputClassName={`w-full ${
                      touched.currentPassword && errors.currentPassword
                        ? 'border border-red-500'
                        : ''
                    }`}
                  />
                )}
              </Field>

              <ErrorMessage
                name="currentPassword"
                component="div"
                className="p-error"
              />
            </div>

            <Button
              size="small"
              type="submit"
              label="Enregistrer"
              loading={isLoading}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};
