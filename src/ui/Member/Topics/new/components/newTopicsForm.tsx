import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TopicType, TopicStatus } from "@prisma/client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ThemeOutput } from "@/typings/theme";
import { Toast } from "primereact/toast";
import { topicSchema } from "@/validators/topic.validator";
import { validateWithZod } from "@/ui/common/utils/validation-with-zod";
import { FileUpload } from "primereact/fileupload";
import { v4 } from "uuid";
import { storage } from "@/config/firebase";
import { useSession } from 'next-auth/react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface TopicFormValues {
    title: string;
    content: string;
    status?: TopicStatus;
    topicTypeId: number | undefined;
    coverImage?: string;
    themeId: string | null;
}

const NewTopicsForm: React.FC = () => {
    const { data: session } = useSession();
    const toastRef = useRef<Toast>(null);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isPublishingTopic, setIsPublishingTopic] = useState(false);
    const [isFetchingThemes, setIsFetchingThemes] = useState(false);
    const [isFetchingTopicTypes, setIsFetchingTopicTypes] = useState(false);
    const [availableTopicTypes, setAvailableTopicTypes] = useState<TopicType[]>([]);
    const [availableThemes, setAvailableThemes] = useState<ThemeOutput[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<ThemeOutput | null>(null);
    const [selectFile, setSelectFile] = useState<File | null>(null);

    const toolbarOptions = [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ];

    useEffect(() => {
        const fetchTopicTypes = async () => {
            setIsFetchingTopicTypes(true);
            try {
                const response = await fetch('/api/topic/type');
                if (!response.ok) throw new Error('Erreur lors de la récupération des types de thématique');
                const { topicTypes } = await response.json();
                setAvailableTopicTypes(topicTypes);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetchingTopicTypes(false);
            }
        };

        fetchTopicTypes();
    }, []);

    useEffect(() => {
        const fetchThemes = async () => {
            setIsFetchingThemes(true);
            try {
                const response = await fetch("/api/theme");
                if (!response.ok) throw new Error('Erreur lors de la récupération des thèmes');
                const { themes } = await response.json();
                setAvailableThemes(themes);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetchingThemes(false);
            }
        };
        fetchThemes();
    }, []);

    const handleTopicSave = useCallback(
        async (formValues: TopicFormValues, status: TopicStatus) => {
            const userId = session?.user.id;
            const isDraft = status === "DRAFT";
            isDraft ? setIsSavingDraft(true) : setIsPublishingTopic(true);

            let storageRef: string | null = null;

            const uploadFileCover = async (file: File): Promise<string | null> => {
                const refPath = `topic/cover/${file.name}-${v4()}`;
                const fileRef = ref(storage, refPath);
                await uploadBytes(fileRef, file);
                return await getDownloadURL(fileRef);
            };

            try {
                if (selectFile) {
                    storageRef = await uploadFileCover(selectFile);
                }

                const response = await fetch(`/api/topic/${status}/${userId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formValues,
                        coverImage: storageRef,
                    }),
                });

                if (!response.ok) throw new Error("Erreur lors de l'enregistrement du sujet");

                toastRef.current?.show({
                    severity: isDraft ? "info" : "success",
                    summary: isDraft ? "Brouillon enregistré" : "Sujet publié",
                    detail: isDraft
                        ? "Le brouillon a été enregistré avec succès."
                        : "Le sujet a été publié avec succès.",
                });
            } catch (error: any) {
                console.log(error);
                toastRef.current?.show({
                    severity: "error",
                    summary: "Erreur",
                    detail: `Une erreur est survenue lors de l'enregistrement du sujet: ${error.message}`,
                });
            } finally {
                isDraft ? setIsSavingDraft(false) : setIsPublishingTopic(false);
            }
        },
        [selectFile, session?.user.id]
    );


    return (
        <>
            <Toast ref={toastRef} />

            <Formik<TopicFormValues>
                initialValues={{
                    title: "",
                    content: "",
                    topicTypeId: undefined,
                    themeId: null,
                    coverImage: ''
                }}
                validate={validateWithZod(topicSchema)}
                onSubmit={async (formValues, { setSubmitting, resetForm }) => {
                    await handleTopicSave(formValues, "PUBLISHED");
                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({ setFieldValue, values, errors, touched }) => (
                    <Form className="flex flex-col gap-8 items-start w-full">
                        <div className="flex flex-col gap-4 items-start w-full">
                            <div className="p-field">
                                <label htmlFor="type">Type de sujet<span className='text-red-500'>*</span></label>
                                <div className="flex flex-wrap items-center gap-4">
                                    {
                                        isFetchingTopicTypes ? <div className='flex flex-row items-center w-full justify-center'>
                                            <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                        </div> : (
                                            <>
                                                {
                                                    availableTopicTypes.length === 0 ? (
                                                        <>Aucun type de thématique n&apos;est disponible.</>
                                                    ) : (
                                                        availableTopicTypes.map((topicType, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => setFieldValue("topicTypeId", topicType.id)}
                                                                className={`px-4 py-1 rounded-md w-fit h-fit cursor-pointer font-semibold ${values.topicTypeId === topicType.id
                                                                    ? "bg-blue-900 text-white"
                                                                    : "bg-gray-200 text-gray-700"
                                                                    } ${touched.topicTypeId && errors.topicTypeId && 'border border-red-500'}`}
                                                            >
                                                                {topicType.name}
                                                            </div>

                                                        ))
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                                {
                                    touched.topicTypeId && errors.topicTypeId && (
                                        <div className="text-sm text-red-500">{errors.topicTypeId}</div>
                                    )
                                }
                            </div>

                            <div className="p-field">
                                <label htmlFor="title">
                                    Titre <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    name="title"
                                    as={InputText}
                                    type="text"
                                    placeholder="Saisissez un titre"
                                    className={`p-inputtext p-component ${touched.title && errors.title ? "border border-red-500" : ''}`}
                                />
                                <ErrorMessage name="title" component="div" className="p-error" />
                            </div>
                            <div className="p-field">
                                <label htmlFor="content">Contenu<span className='text-red-500'>*</span></label>
                                <ReactQuill theme="snow" modules={{ toolbar: toolbarOptions }} className={`bg-white ${touched.content && errors.content && 'border border-red-500 rounded-md'}`} onChange={(e) => setFieldValue('content', e)} />
                                <ErrorMessage name="content" component="div" className="p-error" />
                            </div>

                            <div className="p-field">
                                <label htmlFor="theme">Espace<span className='text-red-500'>*</span></label>
                                <Dropdown
                                    id="theme"
                                    value={selectedTheme}
                                    options={availableThemes}
                                    loading={isFetchingThemes}
                                    onChange={(e) => {
                                        setSelectedTheme(e.value);
                                        setFieldValue("themeId", e.value.id);
                                    }}
                                    optionLabel="title"
                                    placeholder="Sélectionnez un espace"
                                    className={`w-full ${touched.themeId && errors.themeId && "border border-red-500"}`}
                                />
                                <ErrorMessage name="themeId" component="div" className="p-error" />
                            </div>
                        </div>
                        <div className="p-field">
                            <label htmlFor="coverImage">Image de Couverture <span className='text-gray-500'>(facultatif)</span></label>
                            <div className={`flex flex-row gap-4 items-center border ${touched.coverImage && errors.coverImage ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white  p-2`}>
                                <FileUpload
                                    mode="basic"
                                    chooseLabel="Choisir un fichier"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    auto
                                    onSelect={(e) => {
                                        const file = e.files[0];
                                        setFieldValue('coverImage', 'https://firebase.com/images/cover-images.png');
                                        setSelectFile(file);
                                    }}
                                />
                                {!selectFile ? (
                                    <span>Aucun fichier sélectionné</span>
                                ) : (
                                    <span>{selectFile.name}</span>
                                )}
                            </div>
                            <ErrorMessage name="coverImage" component="div" className="p-error" />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                label="Sauvegarder le brouillon"
                                icon="pi pi-save"
                                className="p-button-secondary"
                                onClick={() => handleTopicSave(values, "DRAFT")}
                                disabled={isSavingDraft || isPublishingTopic}
                                loading={isSavingDraft}
                            />
                            <Button
                                type="submit"
                                label="Publier"
                                icon="pi pi-check"
                                className="p-button-success"
                                disabled={isSavingDraft || isPublishingTopic}
                                loading={isPublishingTopic}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default NewTopicsForm;
