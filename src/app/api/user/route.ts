import { NextResponse } from "next/server";
import { handleCreate, handleGetAllUsers } from "./handler";
import { handleError } from "../utils/request";
import { userSchema } from "@/validators/user.validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const request = userSchema.parse(body);

    const user = await handleCreate(request);

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function GET(req: Request) {
  try {
    const users = await handleGetAllUsers();

    return NextResponse.json({ users }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
