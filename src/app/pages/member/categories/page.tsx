'use client';

import React, { useState, useEffect } from 'react';
import { Theme, TopicType } from '@prisma/client';
import MemberPage from '../MemberPage';
import ThemesList from '@/app/components/member/categories/ThemesList';
import TopicTypesList from '@/app/components/member/categories/TopicTypesList';

const CategoriesPage: React.FC = () => {
  const [isFetching, setIsFetching] = useState<{
    themes: boolean;
    topicTypes: boolean;
  }>({
    themes: false,
    topicTypes: false,
  });
  const [themes, setThemes] = useState<Theme[] | []>([]);
  const [topicTypes, setTopicTypes] = useState<TopicType[] | []>([]);

  const fetchAllThemes = async () => {
    try {
      setIsFetching(prevValue => ({
        ...prevValue,
        themes: true,
      }));

      const themesRes = await fetch('/api/theme');

      if (!themesRes.ok) {
        throw new Error('Erreur lors de la récupération des thèmes');
      }

      const { themes } = await themesRes.json();

      setThemes(themes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(prevValue => ({
        ...prevValue,
        themes: false,
      }));
    }
  };

  const fetchAllTopicTypes = async () => {
    try {
      setIsFetching(prevValue => ({
        ...prevValue,
        topicTypes: true,
      }));

      const topicTypeRes = await fetch('/api/topic/type');

      if (!topicTypeRes.ok) {
        throw new Error('Erreur lors de la récupération des types de sujet');
      }

      const { topicTypes } = await topicTypeRes.json();

      setTopicTypes(topicTypes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(prevValue => ({
        ...prevValue,
        topicTypes: false,
      }));
    }
  };

  useEffect(() => {
    fetchAllThemes();
    fetchAllTopicTypes();
  }, []);

  return (
    <MemberPage>
      <div className="flex flex-col gap-8 w-full">
        <ThemesList isFetching={isFetching} themes={themes} />
        <TopicTypesList isFetching={isFetching} topicTypes={topicTypes} />
      </div>
    </MemberPage>
  );
};
export default CategoriesPage;
