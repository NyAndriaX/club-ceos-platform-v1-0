'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSearchParams } from 'next/navigation';
import { TopicOutput, TopicTypeOutput } from '@/typings/topic';
import { UserOutput } from '@/typings';
import { ThemeOutput } from '@/typings/theme';
import { Tag } from 'primereact/tag';
import ColorThief from 'color-thief-browser';
import { MemberPage } from '@/ui/common/components/layout/MemberLayout/MemberPage';

export const ProfilView = () => {
  const router = useRouter();
  const search = useSearchParams();
  const userId = search.get('userId');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<
    { topic: TopicOutput; topicType: TopicTypeOutput; theme: ThemeOutput }[]
  >([]);
  const [user, setUser] = useState<Partial<UserOutput> | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [isFetchingTopics, setIsFetchingTopics] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!userId) {
        setError("Aucun identifiant d'utilisateur fourni.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de l'utilisateur.");
        const { user } = await response.json();
        setUser(user);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [userId]);

  useEffect(() => {
    const fetchAllTopics = async () => {
      if (!user?.id) return;

      setIsFetchingTopics(true);
      try {
        const response = await fetch(`/api/topic/PUBLISHED/${user.id}`);
        const { topics: fetchedTopics } = await response.json();

        const topicsWithType = await Promise.all(
          fetchedTopics.map(async (topic: TopicOutput) => {
            const responseAsFetchTopicType = await fetch(
              `/api/topic/type/${topic.topicTypeId}`,
            );
            const { topicType: fetchedTopicType } =
              await responseAsFetchTopicType.json();
            const responseAsFetchTheme = await fetch(
              `/api/theme/${topic.themeId}`,
            );
            const { theme: fetchedTheme } = await responseAsFetchTheme.json();
            return { topic, topicType: fetchedTopicType, theme: fetchedTheme };
          }),
        );

        setTopics(topicsWithType);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingTopics(false);
      }
    };

    fetchAllTopics();
  }, [user?.id]);

  useEffect(() => {
    const getDominantColors = async () => {
      if (topics.length === 0) return;

      const colors: string[] = await Promise.all(
        topics.map(async ({ topic, topicType }) => {
          const imgSrc = topic.coverImage ?? topicType.coverImage;
          if (!imgSrc) return 'white';

          const image = document.createElement('img') as HTMLImageElement;
          image.crossOrigin = 'Anonymous';
          image.src = imgSrc;

          return new Promise<string>(resolve => {
            image.onload = () => {
              const colorThief = new ColorThief();
              const [r, g, b] = colorThief.getColor(image);
              resolve(`rgb(${r}, ${g}, ${b})`);
            };
            image.onerror = () => resolve('white');
          });
        }),
      );
      setDominantColors(colors);
    };
    getDominantColors();
  }, [topics]);

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  return (
    <>
      {loading && (
        <ProgressSpinner
          style={{ width: '30px', height: '30px' }}
          strokeWidth="8"
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && user && (
        <MemberPage
          header={
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <Avatar
                  image={user.profile ?? defaultProfileImage}
                  shape="circle"
                  size="xlarge"
                  className="cursor-pointer"
                />
                <div>
                  <h2 className="text-xl font-semibold">{user.lastName}</h2>
                  <p className="text-gray-500 font-light text-base">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {dayjs(user.createdAt).format('DD/MM/YYYY')}
                </h2>
                <p className="text-gray-500 text-lg">Inscription</p>
              </div>
            </div>
          }
          className="bg-white w-full max-w-6xl"
          headerClassName="bg-white"
        >
          <div className="flex justify-between gap-4 items-start p-4">
            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-gray-900 font-semibold">À propos</h2>
              <p
                className={`text-gray-500 font-normal w-full text-base ${!user.bio && 'text-center'}`}
              >
                {user.bio || "Aucune bio n'est écrite !"}
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-gray-50 min-w-[250px] p-4 rounded-md">
              <h2 className="text-gray-900 font-semibold">Informations</h2>
              <div>
                <h3 className="text-gray-500">Poste occupé</h3>
                <p className="text-gray-900 text-base">{user.jobTitle}</p>
              </div>
              <div>
                <h3 className="text-gray-500">Entreprise</h3>
                <p className="text-gray-900 text-base">{user.companyName}</p>
              </div>
              <div>
                <h3 className="text-gray-500">Site web</h3>
                <p className="text-gray-900 text-base">{user.companyWebsite}</p>
              </div>
              <div>
                <h3 className="text-gray-500">Profil LinkedIn</h3>
                <p className="text-gray-900 text-base">{user.linkedInUrl}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-2xl font-semibold">Activité</h3>
            <div className="flex flex-col gap-4 p-2">
              {isFetchingTopics ? (
                <div className="flex flex-row items-center justify-center">
                  <ProgressSpinner
                    style={{ width: '30px', height: '30px' }}
                    strokeWidth="8"
                  />
                </div>
              ) : topics.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Aucune activité n&apos;est disponible.
                </p>
              ) : (
                topics.map(async ({ topic, topicType, theme }, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row gap-16 items-start p-4 rounded-md transition hover:bg-gray-50 overflow-hidden w-full relative border border-gray-200 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/member/topics/${encodeURIComponent(topic.title)}?topicId=${encodeURIComponent(topic.id)}`,
                        )
                      }
                    >
                      <Image
                        src={
                          topic.coverImage ?? (topicType.coverImage as string)
                        }
                        className="rounded-md object-cover w-72 h-40"
                        width={300}
                        height={300}
                        alt={`Image de ${topic.title}`}
                        unoptimized
                      />
                      <div className="flex-1 flex flex-col gap-4 items-start justify-between h-full overflow-hidden">
                        <div className="flex flex-col gap-2 h-full w-full">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {topic.title}
                          </h3>
                          <div className="flex flex-row items-end w-full">
                            <div className="flex-1">
                              <span
                                className="text-base text-gray-700 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: topic.content.replace(/<\/?p>/g, ''),
                                }}
                              />
                              <Link
                                href={`/topic/${topic.id}`}
                                className="underline text-xs text-blue-500 ml-1"
                              >
                                Lire la suite
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row w-full justify-between items-center">
                          <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
                            <div className="flex flex-row gap-2 items-center">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: dominantColors[index],
                                }}
                              />
                              <span className="line-clamp-2 w-48">
                                {theme.title}
                              </span>
                            </div>
                            <Tag
                              value={topicType.name}
                              style={{ backgroundColor: dominantColors[index] }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </MemberPage>
      )}
    </>
  );
};
