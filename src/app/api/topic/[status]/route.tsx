import { NextResponse } from "next/server";
import { TopicStatus } from "@prisma/client";
import { handleError } from "../../utils/request";
import { handleCreate, handleGetAllTopics } from "./handler";
import { topicSchema } from "@/validators/topic.validator";

export async function POST(
  req: Request,
  { params }: { params: { status: TopicStatus } }
) {
  try {
    const { status } = params;
    const body = await req.json();

    const request = topicSchema.parse(body);

    const valueTopic = { ...request, status: status };

    const topic = await handleCreate(valueTopic);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { status: TopicStatus } }
) {
  try {
    const { status } = params;
    const topics = await handleGetAllTopics({ status: status });

    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
