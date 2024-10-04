import React, { useState, useRef } from 'react';
import { Toast } from "primereact/toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { validateWithZod } from "@/ui/common/utils/validation-with-zod";
import { topicTypeSchema } from '@/validators/topic.validator';
import { TopicTypeInput } from '@/typings/topic';
import { classNames } from 'primereact/utils';

export const NewTopicTypeForm = () => {
    const toast = useRef<Toast>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async (data: TopicTypeInput, resetForm: () => void) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/topic/type", {
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
                detail: "Type de Thématique enregistrée avec succès.",
                life: 3000,
            });

            resetForm();
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Erreur",
                detail: "Impossible d'enregistrer le type thématique. Veuillez réessayer.",
                life: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return <>

        <Toast ref={toast} />
        <Formik
            initialValues={{
                name: ""
            }}
            validate={validateWithZod(topicTypeSchema)}
            onSubmit={(values, { resetForm }) => {
                onSubmit(values, resetForm);
            }}
        >
            {({ errors, touched }) => (
                <Form className="flex flex-col gap-4">
                    <div className="p-field">
                        <label htmlFor="title">
                            Nom<span className="text-red-500">*</span>
                        </label>
                        <Field name="name">
                            {({ field }: any) => (
                                <InputText
                                    id="name"
                                    {...field}
                                    placeholder="Saisissez un nom"
                                    className={classNames("p-inputtext p-component w-full", {
                                        "border border-red-500": touched.name && errors.name,
                                    })}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="title" component="div" className="p-error" />
                    </div>
                    <div className="flex flex-row items-center justify-start mt-4 gap-4 w-full">
                        <Button
                            type="button"
                            icon="pi pi-times"
                            outlined
                            label="Annuler"
                            className="text-red-500 border-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700"
                            disabled={isLoading}
                            onClick={() => console.log("Annuler")}
                        />
                        <Button
                            type="submit"
                            icon="pi pi-check"
                            loading={isLoading}
                            disabled={isLoading}
                            label="Enregistrer"
                        />
                    </div>
                </Form>
            )}
        </Formik>
    </>
}