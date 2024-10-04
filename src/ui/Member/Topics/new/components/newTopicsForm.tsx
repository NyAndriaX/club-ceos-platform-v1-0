import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TopicType, TopicStatus } from "@prisma/client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ThemeOutput } from "@/typings/theme";
import { Toast } from "primereact/toast";
import { topicSchema } from "@/validators/topic.validator";
import { validateWithZod } from "@/ui/common/utils/validation-with-zod";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { storage } from "@/config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

// Types pour le formulaire
interface TopicFormValues {
  title: string;
  content: string;
  status?: TopicStatus;
  type: TopicType | "";
  themeId: string | null;
}

// Fonction pour traiter les images dans le contenu
async function uploadEmbeddedImages(content: string): Promise<string> {
  const contentContainer = document.createElement("div");
  contentContainer.innerHTML = content;

  const imageElements = contentContainer.getElementsByTagName("img");
  const imageUploadPromises = Array.from(imageElements).map(async (img) => {
    if (img.src.startsWith("data:image")) {
      const file = await fetch(img.src)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], `image-${Date.now()}.png`, { type: "image/png" })
        );

      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
        );
      });

      img.src = downloadURL;
    }
  });

  await Promise.all(imageUploadPromises);

  return contentContainer.innerHTML;
}

export const NewTopicsForm: React.FC = () => {
  const toastRef = useRef<Toast>(null);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isPublishingTopic, setIsPublishingTopic] = useState<boolean>(false);
  const [isFetchingThemes, setIsFetchingThemes] = useState<boolean>(false);
  const [availableThemes, setAvailableThemes] = useState<ThemeOutput[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOutput | null>(null);

  const topicTypeOptions = useMemo(
    () => [
      { label: "Annonce", value: "ANNONCE" as TopicType },
      { label: "Question", value: "QUESTION" as TopicType },
      { label: "Communauté", value: "COMMUNAUTE" as TopicType },
      { label: "Événement", value: "EVENEMENT" as TopicType },
      { label: "Guide", value: "GUIDE" as TopicType },
      { label: "Articles", value: "ARTICLES" as TopicType },
    ],
    []
  );

  useEffect(() => {
    const fetchThemes = async () => {
      setIsFetchingThemes(true);
      try {
        const response = await fetch("/api/theme");
        const { themes } = await response.json();
        setAvailableThemes(themes);
      } catch (error) {
        console.error("Erreur lors de la récupération des thèmes :", error);
      } finally {
        setIsFetchingThemes(false);
      }
    };
    fetchThemes();
  }, []);

  const handleTopicSave = useCallback(
    async (formValues: TopicFormValues, status: TopicStatus) => {
      const isDraft = status === "DRAFT";
      isDraft ? setIsSavingDraft(true) : setIsPublishingTopic(true);

      try {
        const response = await fetch(`/api/topic/${status}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });

        if (response.ok) {
          toastRef.current?.show({
            severity: isDraft ? "info" : "success",
            summary: isDraft ? "Brouillon enregistré" : "Sujet publié",
            detail: isDraft
              ? "Le brouillon a été enregistré avec succès."
              : "Le sujet a été publié avec succès.",
          });
        } else {
          throw new Error("Erreur lors de l'enregistrement du sujet");
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: `Une erreur est survenue lors de l'enregistrement du sujet: ${error.message}`,
        });
      } finally {
        isDraft ? setIsSavingDraft(false) : setIsPublishingTopic(false);
      }
    },
    []
  );

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handlePasteUpload = async (event: any) => {
    const files = event.clipboardData?.items || event.dataTransfer?.files;
    if (files) {
      for (const item of files) {
        if (item.type.startsWith("image")) {
          const file = item.getAsFile ? item.getAsFile() : item;
          if (file) {
            const imageUrl = await uploadImage(file);
            return imageUrl;
          }
        }
      }
    }
    return null;
  };

  return (
    <>
      <Toast ref={toastRef} />

      <Formik<TopicFormValues>
        initialValues={{
          title: "",
          content: "",
          type: "ANNONCE",
          themeId: null,
        }}
        validate={validateWithZod(topicSchema)}
        onSubmit={async (formValues, { setSubmitting, resetForm }) => {
          const processedContent = await uploadEmbeddedImages(
            formValues.content
          );
          const valuesWithProcessedContent = {
            ...formValues,
            content: processedContent,
          };
          await handleTopicSave(valuesWithProcessedContent, "PUBLISHED");
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="flex flex-col gap-8 items-start w-full">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="p-field">
                <label htmlFor="type">Type de sujet</label>
                <div className="flex flex-wrap items-center gap-4">
                  {topicTypeOptions.map((typeOption, index) => (
                    <div
                      key={index}
                      onClick={() => setFieldValue("type", typeOption.value)}
                      className={`px-4 py-1 rounded-md w-fit h-fit cursor-pointer font-semibold ${
                        values.type === typeOption.value
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {typeOption.label}
                    </div>
                  ))}
                </div>
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
                  className={`p-inputtext p-component ${
                    touched.title && errors.title && "border border-red-500"
                  }`}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="p-error"
                />
              </div>

              <div className="p-field">
                <label htmlFor="content">Contenu</label>
                <Editor
                  id="content"
                  value={values.content}
                  onTextChange={(e: EditorTextChangeEvent) =>
                    setFieldValue("content", e.htmlValue ?? "")
                  }
                  onPaste={handlePasteUpload}
                  style={{ height: "300px" }}
                  className={`${
                    touched.content && errors.content
                      ? "border border-red-500"
                      : ""
                  } transition border-1 border-gray-200 hover:border-blue-400 focus:border-2 focus:border-blue-400 rounded-md`}
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="p-error"
                />
              </div>

              <div className="p-field">
                <label htmlFor="theme">Espace</label>
                <Dropdown
                  id="theme"
                  name="theme"
                  value={selectedTheme}
                  loading={isFetchingThemes}
                  onChange={(e) => {
                    setFieldValue("themeId", e.value.id);
                    setSelectedTheme(e.value);
                  }}
                  options={availableThemes}
                  optionLabel="name"
                  placeholder="Sélectionnez un espace"
                  className={`${
                    touched.themeId && errors.themeId && "border border-red-500"
                  }`}
                />
                <ErrorMessage
                  name="themeId"
                  component="div"
                  className="p-error"
                />
              </div>
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
