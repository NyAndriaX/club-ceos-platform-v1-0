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

interface TopicFormValues {
  title: string;
  content: string;
  status?: TopicStatus;
  type: TopicType | "";
  themeId: string | null;
}

export const NewTopicsForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [isLoadingSaveAsDraft, setIsLoadingSaveAsDraft] =
    useState<boolean>(false);
  const [isLoadingPublishTopic, setIsLoadingPublishTopic] =
    useState<boolean>(false);
  const [isLoadingFetchThemes, setIsLoadingFetchThemes] =
    useState<boolean>(false);
  const [listThemes, setListThemes] = useState<ThemeOutput[]>([]);
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
    const fetchAllThemes = async () => {
      setIsLoadingFetchThemes(true);
      try {
        const response = await fetch("/api/theme");
        const { themes } = await response.json();
        setListThemes(themes);
      } catch (error) {
        console.error("Erreur lors de la récupération des thèmes :", error);
      } finally {
        setIsLoadingFetchThemes(false);
      }
    };
    fetchAllThemes();
  }, []);

  const saveTopic = useCallback(
    async (values: TopicFormValues, status: TopicStatus) => {
      status && status === "DRAFT"
        ? setIsLoadingSaveAsDraft(true)
        : setIsLoadingPublishTopic(true);
      try {
        const response = await fetch(`/api/topic/${status}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          toast.current?.show({
            severity: status === "DRAFT" ? "info" : "success",
            summary:
              status === "DRAFT" ? "Brouillon enregistré" : "Sujet publié",
            detail:
              status === "DRAFT"
                ? "Le brouillon a été enregistré avec succès."
                : "Le sujet a été publié avec succès.",
          });
        } else {
          throw new Error("Erreur lors de l'enregistrement du sujet");
        }
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: `Une erreur est survenue lors de l'enregistrement du sujet: ${error.message}`,
        });
      } finally {
        status && status === "DRAFT"
          ? setIsLoadingSaveAsDraft(false)
          : setIsLoadingPublishTopic(false);
      }
    },
    []
  );

  return (
    <>
      <Toast ref={toast} />

      <Formik<TopicFormValues>
        initialValues={{
          title: "",
          content: "",
          type: "ANNONCE",
          themeId: null,
        }}
        validate={validateWithZod(topicSchema)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveTopic(values, "PUBLISHED");
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
                  {topicTypeOptions.map((topicType, index: number) => (
                    <div
                      key={index}
                      onClick={() => setFieldValue("type", topicType.value)}
                      className={`px-4 py-1 rounded-md w-fit h-fit cursor-pointer font-semibold ${
                        values.type === topicType.value
                          ? "bg-blue-900 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {topicType.label}
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
                  onChange={(e) => {
                    setFieldValue("themeId", e.value.id);
                    setSelectedTheme(e.value);
                  }}
                  options={listThemes}
                  loading={isLoadingFetchThemes}
                  optionLabel="title"
                  placeholder="Sélectionner un thème"
                  className={`${
                    touched.themeId && errors.themeId && "border border-red-500"
                  }`}
                />
                <ErrorMessage
                  name="theme"
                  component="div"
                  className="p-error"
                />
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center">
              <Button
                type="button"
                label="Enregistrer le brouillon"
                icon="pi pi-save"
                loading={isLoadingSaveAsDraft}
                disabled={isLoadingSaveAsDraft || isLoadingPublishTopic}
                className="p-button-outlined"
                onClick={() => saveTopic(values, "DRAFT")}
              />
              <Button
                type="submit"
                label="Publier le sujet"
                icon="pi pi-check"
                className="p-button"
                disabled={isLoadingSaveAsDraft || isLoadingPublishTopic}
                loading={isLoadingPublishTopic}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
