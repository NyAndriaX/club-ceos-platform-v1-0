import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import { ThemeInput } from "@/typings/theme";
import { Button } from "primereact/button";
import { themeSchema } from "@/validators/theme.validator";
import { validateWithZod } from "@/ui/common/utils/validation-with-zod";
import { InputTextarea } from "primereact/inputtextarea";

const NewThematicForm = () => {
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: ThemeInput, resetForm: () => void) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Une erreur est survenue lors de l'enregistrement.");

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Thématique enregistrée avec succès.",
        life: 3000,
      });

      resetForm();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'enregistrer la thématique. Veuillez réessayer.",
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
        initialValues={{
          title: "",
          description: "",
        }}
        validate={validateWithZod(themeSchema)}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values, resetForm);
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4">
            <div className="p-field">
              <label htmlFor="title">
                Titre<span className="text-red-500">*</span>
              </label>
              <Field name="title">
                {({ field }: any) => (
                  <InputText
                    id="title"
                    {...field}
                    placeholder="Saisissez un titre"
                    className={`p-inputtext p-component w-full ${
                      touched.title && errors.title
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage name="title" component="div" className="p-error" />
            </div>

            <div className="p-field">
              <label htmlFor="description">Description</label>
              <Field name="description">
                {({ field }: any) => (
                  <InputTextarea
                    id="description"
                    {...field}
                    rows={5}
                    cols={30}
                    placeholder="Saisissez la description du thématique"
                    className={`p-inputtext p-component w-full ${
                      touched.description && errors.description
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="description"
                component="div"
                className="p-error"
              />
            </div>

            <div className="flex flex-row items-center justify-start mt-4 gap-4 w-full">
              <Button
                type="button"
                outlined
                label="Annuler"
                disabled={isLoading}
                onClick={() => console.log("Annuler")}
              />
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                label="Enregistrer le thématique"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewThematicForm;
