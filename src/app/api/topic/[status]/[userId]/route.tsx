import { NextResponse } from 'next/server';
import { Prisma, TopicStatus } from '@prisma/client';
import { handleError } from '@/app/api/utils/request';
import { handleCreate, handleGetAllTopics } from './handler';
import { topicSchema } from '@/app/validators/topic.validator';

export async function POST(
  req: Request,
  { params }: { params: { status: TopicStatus; userId: string } },
) {
  try {
    const { status, userId } = params;
    const body = await req.json();

    const request = topicSchema.parse(body);

    const { themeId, topicTypeId, ...reste } = request;

    const valueTopic: Partial<Prisma.TopicCreateInput> = {
      title: reste.title,
      content: reste.content,
      status: status,
      coverImage: reste.coverImage || null,
      theme: {
        connect: { id: themeId },
      },
      type: {
        connect: { id: topicTypeId },
      },
      author: {
        connect: { id: parseInt(userId) },
      },
    };

    const topic = await handleCreate(valueTopic as Prisma.TopicCreateInput);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { status: TopicStatus; userId: string } },
) {
  try {
    const { status, userId } = params;
    const topics = await handleGetAllTopics({
      status: status,
      userId: parseInt(userId) as number,
    });

    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
