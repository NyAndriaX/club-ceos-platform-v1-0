import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { handleCreate } from "./handler";
import { handleError } from "@/app/api/utils/request";
import { replySchema } from "@/validators/topic.validator";

export async function POST(req: Request, { params }: { params: { topicId: string; userId: string } }) {
  try {
    const { topicId, userId } = params;
    const body = await req.json();

    const request = replySchema.parse(body);

    const valueTopicReply: Prisma.ReplyCreateInput = {
      ...request,
      topic: { connect: { id: parseInt(topicId) } },
      author: { connect: { id: parseInt(userId) } },
    };

    const topicReply = await handleCreate(valueTopicReply);

    return NextResponse.json({ topicReply }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}