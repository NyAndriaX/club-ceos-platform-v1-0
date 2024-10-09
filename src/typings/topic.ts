import { TopicStatus } from '@prisma/client';

export type TopicInput = {
  userId: number | null;
  title: string;
  content: string;
  topicTypeId: number | null;
  themeId: number;
  status?: TopicStatus;
  coverImage?: string | null;
};

export type TopicOutput = {
  id: number;
  userId: number | null;
  title: string;
  content: string;
  topicTypeId: number | null;
  status: TopicStatus;
  themeId: number;
  coverImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
};


export type TopicTypeInput = {
  name: string;
  description: string | null;
  coverImage: string;
}

export type TopicTypeOutput = {
  id: number;
  name: string;
  description: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ReplyInput = {
  content: string
}

export type ReplyOutput = {
  id: number;
  content: string;
  userId: number;
  topicId: number;
  createdAt: Date;
  updatedAt: Date;
}