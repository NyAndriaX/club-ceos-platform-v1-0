'use client';

import { MemberPage } from '@/ui/common/components/layout/MemberLayout/MemberPage';
import { validateWithZod } from '@/ui/common/utils/validation-with-zod';
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { TopicOutput, TopicTypeOutput } from '@/typings/topic';
import { ProgressSpinner } from 'primereact/progressspinner';
import { replySchema } from '@/validators/topic.validator';
import useDominantColor from '@/hooks/useDominantColor';
import { Formik, Form, ErrorMessage } from 'formik';
import { useSearchParams } from 'next/navigation';
import { ThemeOutput } from '@/typings/theme';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { UserOutput } from '@/typings';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { ReplyOutput } from '@/typings/topic';
import { useSession } from 'next-auth/react';
import { ReplyInput } from '@/typings/topic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <ProgressSpinner
      style={{ width: '50px', height: '50px' }}
      strokeWidth="4"
    />
  </div>
);

export const TopicDetailsView = () => {
  const router = useRouter();
  const session = useSession();
  const toastRef = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const topicId = searchParams.get('topicId');
  const [isFetchingTopic, setIsFetchingTopic] = useState<boolean>(true);
  const [isFetchingTopicReply, setIsFetchingTopicReply] =
    useState<boolean>(false);
  const [topicReplies, setTopicReplies] = useState<
    (ReplyOutput & { author: UserOutput })[] | []
  >([]);
  const [topicData, setTopicData] = useState<{
    topic: TopicOutput;
    topicType: TopicTypeOutput;
    theme: ThemeOutput;
    user: UserOutput;
  } | null>(null);

  const backgroundImage = useMemo(() => {
    return (
      topicData?.topic?.coverImage || topicData?.topicType?.coverImage || ''
    );
  }, [topicData]);

  const dominantColor = useDominantColor(backgroundImage);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
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

  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (!topicId) return;
      setIsFetchingTopic(true);

      try {
        const topicRes = await fetch(`/api/topic/unique/${topicId}`);
        if (!topicRes.ok)
          throw new Error('Erreur lors de la récupération du sujet');
        const { topic: fetchedTopic } = (await topicRes.json()) as {
          topic: TopicOutput;
        };

        const [topicTypeRes, themeRes, userRes] = await Promise.all([
          fetch(`/api/topic/type/${fetchedTopic.topicTypeId}`),
          fetch(`/api/theme/${fetchedTopic.themeId}`),
          fetch(`/api/user/${fetchedTopic.userId}`),
        ]);
        if (!userRes.ok)
          throw new Error("Erreur lors de la récupération de l'utilisateur");
        if (!topicTypeRes.ok)
          throw new Error('Erreur lors de la récupération du type de sujet');
        if (!themeRes.ok)
          throw new Error('Erreur lors de la récupération du thème');

        const { user: fetchedUser } = await userRes.json();
        const { theme: fetchedTheme } = await themeRes.json();
        const { topicType: fetchedTopicType } = await topicTypeRes.json();

        setTopicData({
          topic: fetchedTopic,
          topicType: fetchedTopicType,
          theme: fetchedTheme,
          user: fetchedUser,
        });
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

  useEffect(() => {
    const fetchTopicReply = async () => {
      if (!topicId) return;

      setIsFetchingTopicReply(true);

      try {
        const topicReplyRes = await fetch(`/api/topic/reply/${topicId}`);
        if (!topicReplyRes.ok)
          throw new Error(
            'Erreur lors de la récupération des réponses de ce sujet',
          );

        const { topicReplies: fetchedTopicReplies } =
          await topicReplyRes.json();
        setTopicReplies(fetchedTopicReplies);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des réponses de ce sujet :',
          error,
        );
      } finally {
        setIsFetchingTopicReply(false);
      }
    };
    fetchTopicReply();
  }, [topicId]);

  if (isFetchingTopic) return <LoadingSpinner />;

  const { topic, topicType, theme, user } = topicData || {};

  const defaultProfileImage =
    'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png';

  const handleAvatarClick = () => {
    const nom = user?.firstName ?? 'defaultName';
    const userId = user?.id;
    router.push(`/member/users/profil?nom=${nom}&userId=${userId}`);
  };

  const onReply = async (values: ReplyInput) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/topic/reply/${topic?.id}/${user?.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );
      if (!response.ok)
        throw new Error("Erreur lors de l'enregistrement de réponse");

      if (session.data?.user) {
        const newReply: ReplyOutput & { author: UserOutput } = {
          id: topicReplies.length + 1,
          content: values.content,
          userId: session.data.user.id,
          topicId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: session.data.user as any as UserOutput,
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

  return (
    <>
      <Toast ref={toastRef} />
      <div
        className="absolute top-0 left-[7.4rem] w-[101.5vw] rounded-md pt-20 h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '50vh',
        }}
      />
      {topic ? (
        <MemberPage
          header={
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl text-gray-900 font-bold max-w-[70%] line-clamp-3">
                {topic.title}
              </h1>
              <Link
                href="/member/home"
                className="flex flex-row gap-2 items-center border-b border-blue-500 text-sm font-normal text-blue-500"
              >
                <span
                  className="pi pi-arrow-left"
                  style={{ fontSize: '0.75rem' }}
                />
                <span>Revenir à l&apos;accueil</span>
              </Link>
            </div>
          }
          className="max-w-6xl bg-white z-40 shadow-sm"
          headerClassName="bg-white"
        >
          <div className="flex flex-row items-start p-4 justify-between gap-16">
            <div className="flex flex-col gap-8 items-start w-full">
              <div
                dangerouslySetInnerHTML={{ __html: topic.content }}
                className="border-b border-gray-200 text-gray-500 pb-12 w-full"
              />

              <div className="flex flex-col gap-4 items-start w-full">
                <h3 className="text-lg font-semibold text-gray-900">
                  {!isFetchingTopicReply ? (
                    topicReplies.length
                  ) : (
                    <ProgressSpinner
                      style={{ width: '20px', height: '20px' }}
                      strokeWidth="4"
                    />
                  )}{' '}
                  réponse
                </h3>
                <div className="flex flex-col gap-4 w-full">
                  {isFetchingTopicReply ? (
                    <div className="flex flex-row justify-center items-center w-full">
                      <ProgressSpinner
                        style={{ width: '30px', height: '30px' }}
                        strokeWidth="4"
                      />
                    </div>
                  ) : (
                    <>
                      {topicReplies
                        .slice(0, visibleCount)
                        .map((topicReply, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col gap-6 border-b border-gray-100 w-full pb-4"
                          >
                            <div className="flex flex-row items-center gap-4">
                              <Avatar
                                image={
                                  topicReply.author.profile ??
                                  defaultProfileImage
                                }
                                shape="circle"
                                size="large"
                                className="cursor-pointer border border-gray-300 shadow-lg"
                              />
                              <span className="text-lg font-bold text-gray-900">
                                {topicReply.author.firstName}{' '}
                                {topicReply.author.lastName}
                              </span>
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: topicReply.content,
                              }}
                              className="text-base font-normal text-gray-700 pl-8"
                            />
                          </div>
                        ))}
                      {visibleCount < topicReplies.length && (
                        <Button
                          label="Afficher plus"
                          icon="pi pi-angle-down"
                          onClick={handleShowMore}
                          className="mt-4 p-button-sm p-button-info"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start">
                <Formik
                  initialValues={{
                    content: '',
                  }}
                  validate={validateWithZod(replySchema)}
                  onSubmit={onReply}
                >
                  {({ errors, touched, setFieldValue }) => (
                    <Form className="flex flex-col gap-8 items-start w-full">
                      <div className="p-field">
                        <ReactQuill
                          theme="snow"
                          modules={{ toolbar: toolbarOptions }}
                          className={`bg-white ${touched.content && errors.content && 'border border-red-500 rounded-md'}`}
                          onChange={e => setFieldValue('content', e)}
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="p-error"
                        />
                      </div>
                      <Button
                        type="submit"
                        label="Répondre"
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="flex flex-col gap-6 min-w-[300px]">
              <div className="flex flex-row gap-2 items-center justify-between w-full">
                {dominantColor && (
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: dominantColor }}
                  />
                )}
                <span className="text-lg font-semibold text-gray-900 line-clamp-2 w-[90%]">
                  {theme?.title}
                </span>
              </div>
              <div className="flex flex-row gap-4 p-2 items-start">
                <Avatar
                  image={user?.profile ?? defaultProfileImage}
                  shape="circle"
                  size="xlarge"
                  className="cursor-pointer"
                  onClick={handleAvatarClick}
                />
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex flex-col">
                    <p className="text-base text-gray-900 font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.jobTitle}</p>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    {user && user.linkedInUrl && (
                      <Link
                        href={user?.linkedInUrl as string}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span
                          className="pi pi-linkedin text-blue-900"
                          style={{ fontSize: '1.5rem' }}
                        ></span>
                      </Link>
                    )}
                    {user && user.companyWebsite && (
                      <Link
                        href={user.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span
                          className="pi pi-globe text-blue-900"
                          style={{ fontSize: '1.5rem' }}
                        ></span>
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-start text-sm text-blue-500">
                    <Link
                      href={'/'}
                      className="flex flex-row items-start gap-4"
                    >
                      <span className="underline">
                        Supprimer définitivement
                      </span>
                      <span className="pi pi-trash"></span>
                    </Link>
                    <Link
                      href={'/'}
                      className="flex flex-row items-start gap-4"
                    >
                      <span className="underline">Editer un sujet</span>
                      <span className="pi pi-pencil"></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MemberPage>
      ) : (
        <p className="text-center text-lg text-gray-500 mt-8">
          Le sujet n&apos;a pas pu être chargé. Veuillez réessayer.
        </p>
      )}
    </>
  );
};
