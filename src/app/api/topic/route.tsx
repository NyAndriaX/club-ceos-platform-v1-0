import { NextResponse } from "next/server";
import { handleError } from "../utils/request";
import { handleCreate } from "./handler";
import { topicSchema } from "@/validators/topic.validator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const request = topicSchema.parse(body);

    const topic = await handleCreate(request);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
