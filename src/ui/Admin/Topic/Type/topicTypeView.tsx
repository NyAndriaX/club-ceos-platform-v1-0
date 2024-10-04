"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { TopicTypeOutput } from "@/typings/topic";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';
import { AdminPage } from "@/ui/common/components/layout/AdminLayout/AdminPage";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export const TopicTypeView = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [filters, setFilters] = useState<{ globalFilters: string }>({
        globalFilters: "",
    });
    const [topicTypes, setTopicTypes] = useState<TopicTypeOutput[] | []>([]);
    const [isFetchingTopicTypes, setIsFetchingTopicTypes] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [topicTypeToDelete, setTopicTypeToDelete] = useState<TopicTypeOutput | null>(null);

    useEffect(() => {
        const fetchAllTopicTypes = async () => {
            setIsFetchingTopicTypes(true);
            setError(null);

            try {
                const response = await fetch('/api/topic/type');
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des types de sujet");
                }
                const { topicTypes } = await response.json();
                setTopicTypes(topicTypes);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsFetchingTopicTypes(false);
            }
        }

        fetchAllTopicTypes();
    }, []);

    const filteredTopicTypes = useCallback(() => {
        return topicTypes.filter((topicType) => {
            const topicTypeMatch = topicType.name
                .toLowerCase()
                .includes(filters.globalFilters.toLowerCase());

            return topicTypeMatch;
        });
    }, [filters, topicTypes]);

    const confirmDelete = (e: any, topicType: TopicTypeOutput) => {
        setTopicTypeToDelete(topicType);
        confirmPopup({
            target: e.currentTarget,
            message: 'Êtes-vous sûr de vouloir supprimer ce type de thématique ?',
            icon: 'pi pi-exclamation-triangle',
            accept: deleteTopicType,
            reject: () => setTopicTypeToDelete(null)
        });
    };

    const deleteTopicType = async () => {
        if (!topicTypeToDelete) return;

        try {
            const response = await fetch(`/api/topic/type/${topicTypeToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du type de sujet");
            }
            setTopicTypes((prev) => prev.filter((type) => type.id !== topicTypeToDelete.id));
            toast.current?.show({ severity: 'success', summary: 'Succès', detail: 'Type de thématique supprimé avec succès' });
        } catch (error: any) {
            setError(error.message);
            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: error.message });
        } finally {
            setTopicTypeToDelete(null);
        }
    };

    return (
        <AdminPage
            title={
                <div className="flex flex-row gap-4 items-center w-full justify-between">
                    <h1>Types de thématiques</h1>
                    <Button outlined onClick={() => router.push("/admin/topic/type/new")}>
                        Créer un nouveau type de thématiques
                    </Button>
                </div>
            }
        >
            <Toast ref={toast} />
            <main className="flex flex-col gap-4">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        type="text"
                        placeholder="Rechercher"
                        value={filters.globalFilters}
                        onChange={(e) => {
                            setFilters((prevFilters) => ({
                                ...prevFilters,
                                globalFilters: e.target.value,
                            }));
                        }}
                        className="md:p-inputtext-md lg:p-inputtext-lg"
                        aria-label="Rechercher une thématique"
                    />
                </IconField>

                {
                    isFetchingTopicTypes ? (
                        <p>Chargement des thématiques...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="flex flex-row gap-4">
                            {
                                filteredTopicTypes().length <= 0 ? (
                                    <div className="text-center text-gray-500">
                                        Aucun type de sujet ne correspond à vos critères de recherche.
                                        Essayez d&apos;ajuster les filtres ou de rechercher un autre
                                        nom.
                                    </div>
                                ) : (
                                    filteredTopicTypes().map((topicType, index: number) => (
                                        <Tag key={index} style={{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' }}>
                                            <div className="flex flex-row items-center gap-4">
                                                <span className="text-base">{topicType.name}</span>
                                                <Button
                                                    icon="pi pi-times"
                                                    rounded
                                                    outlined
                                                    text
                                                    onClick={(event) => confirmDelete(event, topicType)}
                                                    aria-label="Supprimer"
                                                />
                                            </div>
                                        </Tag>
                                    ))
                                )
                            }
                        </div>
                    )
                }
            </main>

            <ConfirmPopup />
        </AdminPage>
    );
};
