"use client";

import { ListApprovedUser } from "./components/ListApprovedUser";
import { ListUsersAwaitingApproval } from "./components/ListUsersAwaitingApproval";

export function RegistrationRequestsView() {
  return (
    <div className="flex flex-col mx-auto gap-4 lg:px-8 lg:py-4">
      <h1 className="text-lg md:text-2xl font-bold pb-2">
        Listes des demandes d&apos;inscription
      </h1>
      <div className="flex flex-col gap-4 lg:gap-8 max-h-[80vh] overflow-y-auto lg:min-w-[70vw]">
        <ListUsersAwaitingApproval />
        <ListApprovedUser />
      </div>
    </div>
  );
}
