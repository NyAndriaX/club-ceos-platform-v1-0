'use client';

import React, { useRef, useState, useEffect } from 'react';
import MemberPage from '../../MemberPage';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User as PrismaUser,
  Reply,
  Topic,
  TopicType,
  Theme,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { useWindow } from '@/features/app/hooks/useWindow';
import { useUserSession } from '@/features/app/hooks/useUserSessionAuth';
import { ReplySection } from '@/features/app/components/member/topic/details/ReplySection';
import { AuthorProfile } from '@/features/app/components/member/topic/details/AuthorProfile';
import { TopicContent } from '@/features/app/components/member/topic/details/TopicContent';
import { TopicHeader } from '@/features/app/components/member/topic/details/TopicHeader';
import { Divider } from 'primereact/divider';

const TopicDetailsPage = () => {
  const router = useRouter();
  const { isMobile } = useWindow();
  const { session } = useUserSession();
  const toastRef = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const topicId = searchParams.get('topicId');
  const [isFetchingTopic, setIsFetchingTopic] = useState<boolean>(true);
  const [topicReplies, setTopicReplies] = useState<
    (Reply & { author: PrismaUser })[] | []
  >([]);
  const [topicData, setTopicData] = useState<
    | (Topic & {
        type: TopicType;
        theme: Theme;
        author: PrismaUser;
        reply: (Reply & { author: PrismaUser })[] | [];
      })
    | null
  >(null);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (!topicId) return;
      setIsFetchingTopic(true);

      try {
        const topicRes = await fetch(`/api/topic/unique/${topicId}`);
        if (!topicRes.ok)
          throw new Error('Erreur lors de la récupération du sujet');
        const { topic: fetchedTopic } = (await topicRes.json()) as {
          topic: Topic & {
            type: TopicType;
            theme: Theme;
            author: PrismaUser;
            reply: (Reply & { author: PrismaUser })[] | [];
          };
        };

        setTopicData(fetchedTopic);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du sujet :',
          error,
        );
      } finally {
        setIsFetchingTopic(false);
      }
    };

    fetchTopicDetails();
  }, [topicId]);

  if (isFetchingTopic) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <ProgressSpinner
          style={{ width: '40px', height: '40px' }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    );
  }

  const onReply = async (values: Partial<Prisma.ReplyCreateInput>) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/topic/reply/${topicId}/${session?.user?.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );
      if (!response.ok)
        throw new Error("Erreur lors de l'enregistrement de réponse");

      if (session?.user) {
        const newReply: Reply & { author: PrismaUser } = {
          id: topicReplies.length + 1,
          content: values.content as string,
          userId: session.user.id,
          topicId: 1,
          votes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: session.user as any as PrismaUser,
        };

        setTopicReplies(prevValues => [newReply, ...prevValues]);
      }

      toastRef.current?.show({
        severity: 'success',
        summary: 'Réponse mis en publié',
        detail: 'La réponse a été publié avec succès.',
      });
    } catch (error) {
      console.log(error);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la publication du réponse.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { type, theme, reply, author, ...topic } = topicData || {};

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  return (
    <>
      <Toast ref={toastRef} />
      <MemberPage>
        <div className="flex flex-col w-full items-center rounded-md">
          <div className="hidden md:flex fixed left-0 top-0 bg-blue-500 opacity-50 h-1/3 w-full z-0" />
          <div className="relative z-30 shadow-none md:shadow-sm bg-none md:bg-white rounded-md max-w-5xl w-full ">
            <div className="md:sticky  px-8 pt-8 md:pb-4 -top-8 z-40 md:bg-opacity-85 md:bg-white  rounded-md">
              <TopicHeader
                topic={topic as Topic}
                router={router}
                topicType={type || null}
              />
              <Divider />
            </div>
            <div className="flex flex-row gap-10  px-8 md:pt-4 pb-8 items-start">
              <div className="flex flex-col items-start w-full md:w-2/3">
                <TopicContent topic={topic as Topic} />
                {isMobile && (
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex-1 flex flex-col gap-4">
                      <AuthorProfile
                        author={author || null}
                        defaultProfileImage={defaultProfileImage}
                      />
                      <div className="flex flex-row gap-4 items-center text-blue-500 text-sm w-fit hover:underline p-0 cursor-pointer">
                        <span className="pi pi-trash"></span>
                        <span>Supprimer définitivement</span>
                      </div>
                      <div
                        className="flex flex-row gap-4 items-center text-blue-500 text-sm w-fit hover:underline p-0 cursor-pointer"
                        onClick={() =>
                          router.push(`/member/topic?topicId=${topicId}`)
                        }
                      >
                        <span className="pi pi-pencil"></span>
                        <span>Editer un sujet</span>
                      </div>
                    </div>
                  </div>
                )}
                <Divider />
                <ReplySection
                  isLoading={isLoading}
                  onReply={onReply}
                  currentUser={session?.user || null}
                  defaultProfileImage={defaultProfileImage}
                  topicReplies={topicReplies}
                />
              </div>
              <div className="hidden md:flex flex-col gap-4 w-1/3">
                <AuthorProfile
                  author={author || null}
                  defaultProfileImage={defaultProfileImage}
                />
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex flex-row gap-4 items-center text-blue-500 text-sm w-fit hover:underline p-0 cursor-pointer">
                    <span className="pi pi-trash"></span>
                    <span>Supprimer définitivement</span>
                  </div>
                  <div
                    className="flex flex-row gap-4 items-center text-blue-500 text-sm w-fit hover:underline p-0 cursor-pointer"
                    onClick={() =>
                      router.push(`/member/topic?topicId=${topicId}`)
                    }
                  >
                    <span className="pi pi-pencil"></span>
                    <span>Editer un sujet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MemberPage>
    </>
  );
};

export default TopicDetailsPage;
