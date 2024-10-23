import { NextResponse } from 'next/server';
import { handleError } from '../../utils/request';
import { topicTypeSchema } from '@/app/validators/topic.validator';
import { handleCreate, handleGetAllTopicTypes } from './handler';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const request = topicTypeSchema.parse(body);

    const topicType = await handleCreate(request);

    return NextResponse.json({ topicType }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: Request) {
  try {
    const topicTypes = await handleGetAllTopicTypes();

    return NextResponse.json({ topicTypes }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
