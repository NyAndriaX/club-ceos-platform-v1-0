import { NextResponse } from "next/server";
import { handleGetUser } from "./handler";
import { handleError } from "../../utils/request";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    const user = await handleGetUser(parseInt(userId) as number);

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}