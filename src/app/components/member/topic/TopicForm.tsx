import React from 'react';
import dynamic from 'next/dynamic';
import { Theme, TopicStatus, TopicType } from '@prisma/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { validate } from '@/app/utils/validation';
import { topicSchema } from '@/app/validators/topic.validator';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface TopicFormProps {
  isSavingDraft: boolean;
  isPublishingTopic: boolean;
  initialValues: any;
  handleTopicSave: (formValues: any, status: TopicStatus) => void;
  isFetching: any;
  availableTopicTypes: TopicType[] | [];
  availableThemes: Theme[] | [];
  toolbarOptions: any[];
  selectedTheme: Theme | null;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme | null>>;
  selectFile: File | null;
  setSelectFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const TopicForm: React.FC<TopicFormProps> = ({
  isPublishingTopic,
  isSavingDraft,
  initialValues,
  handleTopicSave,
  isFetching,
  availableTopicTypes,
  availableThemes,
  toolbarOptions,
  selectedTheme,
  setSelectedTheme,
  selectFile,
  setSelectFile,
}) => {
  return (
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
        <Form className="flex flex-col gap-4 items-start w-full">
          <div className="p-field">
            <label htmlFor="type">Type de sujet</label>
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
                    onClick={() => setFieldValue('topicTypeId', topicType.id)}
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
            <label htmlFor="title">Titre</label>
            <Field
              name="title"
              as={InputText}
              id="title"
              placeholder="Titre du sujet"
              className={`p-inputtext p-component ${
                touched.title && errors.title ? 'border border-red-500' : ''
              }`}
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-600"
            />
          </div>

          <div className="p-field w-full">
            <label htmlFor="content">Contenu</label>
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
                setSelectedTheme(e.value);
                setFieldValue('themeId', e.value.id);
              }}
              placeholder="Sélectionner un thème"
              optionLabel="title"
              className={`w-full ${
                touched.themeId && errors.themeId ? 'border border-red-500' : ''
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
              <span className="text-gray-500 font-light">(facultative)</span>
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
                {selectFile ? selectFile.name : 'Aucun fichier sélectionné'}
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
  );
};

export default TopicForm;
