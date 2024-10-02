import { TopicType, TopicStatus } from '@prisma/client';

export type TopicInput = {
  title: string;
  content: string;
  type: TopicType;
  themeId: number;
  status?: TopicStatus;
};

export type TopicOutput = {
  id: number;
  title: string;
  content: string;
  type: TopicType;
  status: TopicStatus;
  themeId: number;
  createdAt: Date;
  updatedAt: Date;
};
