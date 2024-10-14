import { NextResponse } from 'next/server';
import { handleError } from '../../../utils/request';
import { handleGetTopicById } from './handler';

export async function GET(
  req: Request,
  { params }: { params: { topicId: string } },
) {
  try {
    const { topicId } = params;
    const topic = await handleGetTopicById(parseInt(topicId) as number);
    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
