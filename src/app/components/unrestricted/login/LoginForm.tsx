import React, { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from 'primereact/button';
import { authSchema } from '@/app/validators/auth.validator';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Password } from 'primereact/password';
import { validate } from '@/app/utils/validation';
import { Toast } from 'primereact/toast';

export const LoginForm = () => {
  const toastRef = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const result: any = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log(result);

      if (!result.ok) {
        toastRef.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: result.error,
          life: 3000,
        });
      }

      if (result.ok) {
        window.location.reload();
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: err.message || "Une erreur inattendue s'est produite.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toast ref={toastRef} />
      <Card className="rounded-md shadow-sm w-full">
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validate={validate(authSchema)}
          onSubmit={values => onSubmit(values)}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4 items-start w-full">
              <div className="p-field">
                <label htmlFor="email">E-mail</label>
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
                <div className="flex flex-row gap-4 justify-between items-center">
                  <label htmlFor="password">Mot de passe</label>
                  <Link
                    href="/"
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

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
              <Button
                size="small"
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
                label="Se connecter"
              />
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};
