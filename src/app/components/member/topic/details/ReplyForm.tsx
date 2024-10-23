import React from 'react';
import dynamic from 'next/dynamic';
import { Prisma } from '@prisma/client';
import { Button } from 'primereact/button';
import { Formik, Form, ErrorMessage } from 'formik';
import { replySchema } from '@/app/validators/topic.validator';
import { validate } from '@/app/utils/validation';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface ReplyFormProps {
  isLoading: boolean;
  onReply: (values: Partial<Prisma.ReplyCreateInput>) => Promise<void>;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({ isLoading, onReply }) => {
  const initialValues = {
    content: '',
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
  return (
    <Formik
      initialValues={initialValues}
      validate={validate(replySchema)}
      onSubmit={async (values: typeof initialValues, { resetForm }) => {
        await onReply(values);
        resetForm();
      }}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form className="flex flex-col gap-4 items-start w-full">
          <div className="p-field">
            <ReactQuill
              theme="snow"
              value={values.content}
              modules={{ toolbar: toolbarOptions }}
              className={`bg-white ${touched.content && errors.content && 'border border-red-500 rounded-md'}`}
              onChange={e => setFieldValue('content', e)}
            />
            <ErrorMessage name="content" component="div" className="p-error" />
          </div>
          <Button
            type="submit"
            size="small"
            label="Répondre"
            disabled={isLoading}
            loading={isLoading}
          />
        </Form>
      )}
    </Formik>
  );
};
