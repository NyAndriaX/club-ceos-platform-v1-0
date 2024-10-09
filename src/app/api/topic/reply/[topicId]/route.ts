import { NextResponse } from "next/server";
import { handleError } from "@/app/api/utils/request";
import { handleGetAllTopicReplies } from "./handler";

export async function GET(req: Request, { params }: { params: { topicId: string } }) {
  try {
    const { topicId } = params;

    const topicReplies = await handleGetAllTopicReplies({ topicId: parseInt(topicId) })

    return NextResponse.json({ topicReplies }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}