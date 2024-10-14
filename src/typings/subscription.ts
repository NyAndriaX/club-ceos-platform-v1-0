import { User, Plan } from '@prisma/client';

export type SubscriptionInput = {
  userId: number;
  planId: number;
  startDate?: Date;
  endDate: Date;
};

export type SubscriptionOutput = {
  id: number;
  userId: number;
  planId: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  plan: Plan;
};
