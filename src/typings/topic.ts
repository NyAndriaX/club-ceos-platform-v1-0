import { TopicStatus } from '@prisma/client';

export type TopicInput = {
  title: string;
  content: string;
  topicTypeId: number;
  themeId: number;
  status?: TopicStatus;
};

export type TopicOutput = {
  id: number;
  title: string;
  content: string;
  topicTypeId: number;
  status: TopicStatus;
  themeId: number;
  createdAt: Date;
  updatedAt: Date;
};


export type TopicTypeInput = {
  name: string;
}

export type TopicTypeOutput = {
  id: number;
  name: string;
}