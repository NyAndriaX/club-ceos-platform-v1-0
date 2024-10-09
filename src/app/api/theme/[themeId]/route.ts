import { NextResponse } from "next/server";
import { handleError } from "../../utils/request";
import { handleGetTheme } from "./handler";

export async function GET(req: Request, { params }: { params: { themeId: string } }) {
  try {
    const { themeId } = params;
    const theme = await handleGetTheme(parseInt(themeId) as number);

    return NextResponse.json({ theme }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}