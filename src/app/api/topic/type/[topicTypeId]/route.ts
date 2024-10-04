import { NextResponse } from "next/server";
import { handleError } from "@/app/api/utils/request";
import { handleDelete } from "./handler";

export async function DELETE(request: Request, { params }: { params: { topicTypeId: string } }) {
  const { topicTypeId } = params;

  try {
    await handleDelete(parseInt(topicTypeId) as number);

    return NextResponse.json({ message: "Type de thématique supprimé avec succès" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
