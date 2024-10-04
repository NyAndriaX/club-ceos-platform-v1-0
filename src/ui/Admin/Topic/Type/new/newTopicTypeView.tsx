'use client';

import React from 'react';
import { NewTopicTypeForm } from './composants/newTopicTypeForm';
import { AdminPage } from '@/ui/common/components/layout/AdminLayout/AdminPage';

export const NewTopicTypeTypeView = () => {
    return (
        <AdminPage title='Créer un nouveau type de thématique' className="mx-auto w-2/3"><NewTopicTypeForm /></AdminPage>
    )
}