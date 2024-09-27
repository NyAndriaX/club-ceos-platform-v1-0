import { NextResponse } from "next/server";
import { UserInput } from "@/typings";
import { editUserSchema } from "@/validators/user.validation";
import { handleGetUser, handlePutUser } from "./handler";
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

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const { userId } = params;

    await editUserSchema.parse(body)

    const user = await handlePutUser(parseInt(userId) as number, body as Partial<UserInput>);

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}