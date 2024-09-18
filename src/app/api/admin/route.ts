import { NextResponse } from "next/server";
import { handleError } from "../utils/request";
import { handleGetUsersAwaitingApproval, handleGetApprovedUser, handleApproveAUser, handleUnapproveUser } from "./handler";

export async function POST(req: Request) {

}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    if (!action) {
      throw new Error('Action non définie');
    }

    switch (action) {
      case "getUsersAwaitingApproval":
        const usersAwaitingApproval = await handleGetUsersAwaitingApproval();
        return NextResponse.json({ users: usersAwaitingApproval }, { status: 200 });

      case "getApprovedUser":
        const approvedUsers = await handleGetApprovedUser();
        return NextResponse.json({ users: approvedUsers }, { status: 200 });

      case "approveAUser":
        if (!userId) {
          throw new Error('ID de l\'utilisateur manquant pour l\'approbation');
        }
        const AuthorizedUser = await handleApproveAUser(Number(userId));
        return NextResponse.json({ user: AuthorizedUser }, { status: 200 });

      case "unapproveUser":
        if (!userId) {
          throw new Error('ID de l\'utilisateur manquant pour l\'approbation');
        }
        const UnauthorizedUser = await handleUnapproveUser(Number(userId));
        return NextResponse.json({ user: UnauthorizedUser }, { status: 200 });
      default:
        throw new Error('Action non définie ou invalide');
    }
  } catch (error) {
    return handleError(error);
  }
}
