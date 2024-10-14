import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSigninForm } from './signinForm.hooks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { validateWithZod } from '@/ui/common/utils/validation-with-zod';
import { authSchema } from '@/validators/auth.validation';
import './signinForm.modules.css';

const SigninForm = () => {
  const toast = useRef<Toast>(null);
  const { onSubmit, error, isLoading } = useSigninForm();

  useEffect(() => {
    if (error && toast.current) {
      toast.current.show({
        severity: 'error',
        summary: 'Erreur',
        detail: error,
        life: 3000,
      });
    }
  }, [error]);

  return (
    <>
      <Toast ref={toast} />
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validate={validateWithZod(authSchema)}
        onSubmit={values => onSubmit(values)}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-8 items-start w-full">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="p-field">
                <label htmlFor="email">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`p-inputtext p-component ${
                    touched.email && errors.email && 'border border-red-500'
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="p-error"
                />
              </div>
              <div className="p-field">
                <label htmlFor="email">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <Field name="password">
                  {({ field }: { field: any }) => (
                    <Password
                      id="password"
                      {...field}
                      feedback={false}
                      inputClassName={`w-full ${
                        touched.password &&
                        errors.password &&
                        'border border-red-500'
                      }`}
                      toggleMask
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="p-error"
                />
              </div>
              <Link href="/" className="text-blue-900 text-sm hover:underline">
                Mot de passe oublier ?
              </Link>
            </div>
            <Button
              disabled={isLoading}
              loading={isLoading}
              className="w-full"
              label="Se connecter"
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SigninForm;
