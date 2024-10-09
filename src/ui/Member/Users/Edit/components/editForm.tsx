import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { UserInput, UserOutput } from "@/typings";
import { Toast } from "primereact/toast";
import { useSession } from "next-auth/react";
import { storage } from "@/config/firebase";
import { validateWithZod } from "@/ui/common/utils/validation-with-zod";
import { editUserSchema } from "@/validators/user.validation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Password } from "primereact/password";

type Props = {
    user: Partial<UserOutput>;
};

const EditForm: React.FC<Props> = ({ user }) => {
    const toast = useRef<Toast>(null);
    const { update } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectFile, setSelectFile] = useState<File | null>(null);
    const [receiveAnEmail, setReceiveAnEmail] = useState<boolean>(false);

    const initialValues: Partial<UserInput> = {
        lastName: user?.lastName || "",
        firstName: user?.firstName || "",
        jobTitle: user?.jobTitle || "",
        email: user?.email || "",
        companyName: user?.companyName || "",
        linkedInUrl: user?.linkedInUrl || "",
        companyWebsite: user?.companyWebsite || "",
        profile: user.profile || null,
        bio: user.bio || "",
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
    };

    const onSubmit = async (values: Partial<UserInput>) => {
        setIsLoading(true);
        let storageRef: string | null = null;

        const uploadFile = async (file: File): Promise<string | null> => {
            const refPath = `profiles/${file.name}-${v4()}`;
            const fileRef = ref(storage, refPath);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        };

        try {
            if (selectFile) {
                storageRef = await uploadFile(selectFile);
            }

            const response: any = await fetch(`/api/user/${user?.id as number}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    profile: storageRef,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                const { message } = result;
                throw new Error(message ?? "Erreur lors de l'envoi des données.");
            }

            const { user: updateUser } = await response.json();
            await update(updateUser);

            toast.current?.show({
                severity: "success",
                summary: "Succès",
                detail: "Profil mis à jour avec succès.",
                life: 3000,
            });
            window.scrollTo(0, 0);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la mise à jour du profil.";

            console.error(error);
            toast.current?.show({
                severity: "error",
                summary: "Erreur",
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
                validate={validateWithZod(editUserSchema)}
                onSubmit={(values) => onSubmit(values)}
            >
                {({ errors, touched }) => (
                    <Form className="flex flex-col gap-4 items-start w-full">
                        {/* Nom et Prénom */}
                        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                            <div className="p-field">
                                <label htmlFor="firstName">Prénom</label>
                                <Field
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className={`p-inputtext p-component ${touched.firstName && errors.firstName
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="lastName">Nom</label>
                                <Field
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className={`p-inputtext p-component ${touched.lastName && errors.lastName
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                className={`p-inputtext p-component ${touched.email && errors.email ? "border border-red-500" : ""
                                    }`}
                            />
                            <ErrorMessage name="email" component="div" className="p-error" />
                        </div>

                        {/* Poste et Entreprise */}
                        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                            <div className="p-field">
                                <label htmlFor="jobTitle">Poste occupé</label>
                                <Field
                                    id="jobTitle"
                                    name="jobTitle"
                                    type="text"
                                    className={`p-inputtext p-component ${touched.jobTitle && errors.jobTitle
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="jobTitle"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="companyName">Entreprise</label>
                                <Field
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    className={`p-inputtext p-component ${touched.companyName && errors.companyName
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="companyName"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                        </div>

                        {/* Site web et LinkedIn */}
                        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                            <div className="p-field">
                                <label htmlFor="companyWebsite">Site web</label>
                                <Field
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="url"
                                    className={`p-inputtext p-component ${touched.companyWebsite && errors.companyWebsite
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="companyWebsite"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="linkedInUrl">Profil Linkedin</label>
                                <Field
                                    id="linkedInUrl"
                                    name="linkedInUrl"
                                    type="url"
                                    className={`p-inputtext p-component ${touched.linkedInUrl && errors.linkedInUrl
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                />
                                <ErrorMessage
                                    name="linkedInUrl"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="p-field w-full">
                            <label htmlFor="bio">Bio</label>
                            <Field name="bio">
                                {({ field }: any) => (
                                    <InputTextarea
                                        id="bio"
                                        rows={5}
                                        cols={30}
                                        {...field}
                                        className={`p-inputtext p-component w-full ${touched.bio && errors.bio ? "border border-red-500" : ""
                                            }`}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="bio" component="div" className="p-error" />
                        </div>

                        {/* Notifications par email */}
                        <div className="flex flex-row justify-center items-center w-full">
                            <div className="flex align-items-center">
                                <label htmlFor="receiveAnEmail" className="mr-2">
                                    Recevoir des notifications par email
                                </label>
                                <Checkbox
                                    inputId="receiveAnEmail"
                                    checked={receiveAnEmail}
                                    onChange={() => setReceiveAnEmail((prevValue) => !prevValue)}
                                />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="p-field">
                            <label htmlFor="profilFile">Avatar</label>
                            <div
                                className={`flex flex-row gap-4 items-center border border-gray-300 rounded-md bg-white p-2`}
                            >
                                <FileUpload
                                    mode="basic"
                                    chooseLabel="Choisir un fichier"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    auto
                                    onSelect={(e) => {
                                        const file = e.files[0];
                                        setSelectFile(file);
                                    }}
                                />
                                {!selectFile ? (
                                    <span>Aucun fichier sélectionné</span>
                                ) : (
                                    <span>{selectFile.name}</span>
                                )}
                            </div>
                        </div>
                        <h3 className="text-base my-2 text-center text-gray-900 font-light w-full">
                            Modifier mon mot de passe (laissez ces champs vides si vous ne
                            souhaitez pas le modifier)
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                            <div className="p-field">
                                <label htmlFor="newPassword">Nouveau mot de passe</label>
                                <Field name='newPassword'>
                                    {({ field }: { field: any }) => (
                                        <Password id='password' {...field} feedback={false} inputClassName={`w-full ${touched.password &&
                                            errors.password &&
                                            "border border-red-500"
                                            }`}
                                            onFocus={false}
                                            toggleMask />
                                    )}
                                </Field>
                                <ErrorMessage
                                    name="newPassword"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="confirmPassword">
                                    Confirmez votre mot de passe
                                </label>
                                <Field name='confirmPassword'>
                                    {({ field }: { field: any }) => (
                                        <Password id='confirmPassword' {...field} feedback={false} inputClassName={`w-full ${touched.confirmPassword &&
                                            errors.confirmPassword &&
                                            "border border-red-500"
                                            }`}
                                            onFocus={false}
                                            toggleMask />
                                    )}
                                </Field>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="p-error"
                                />
                            </div>
                        </div>
                        <div className="p-field">
                            <label htmlFor="currentPassword">Mot de passe actuel</label>
                            <Field name='currentPassword'>
                                {({ field }: { field: any }) => (
                                    <Password id='currentPassword' {...field} feedback={false} inputClassName={`w-full ${touched.currentPassword &&
                                        errors.currentPassword &&
                                        "border border-red-500"
                                        }`}
                                        onFocus={false}
                                        toggleMask />
                                )}
                            </Field>
                            <ErrorMessage
                                name="currentPassword"
                                component="div"
                                className="p-error"
                            />
                        </div>

                        {/* Boutons */}
                        <div className="flex flex-col items-center justify-center mt-2 gap-4 w-full">
                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                label="Mettre à jour mon profil"
                            />
                            <Button
                                type="button"
                                disabled={isLoading}
                                severity="danger"
                                text
                                label="Supprimer mon compte"
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default EditForm;
