"use client";

import React, { useState, useRef, useMemo } from "react";
import { AdminPage } from "@/ui/common/components/layout/AdminLayout/AdminPage";
import { Button } from "primereact/button";
import { useParams } from "next/navigation";
import { UserOutput } from "@/typings";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { RegistrationRequestsFile } from "./components/RegistrationRequestsFile";
import { useLocalStorage } from "primereact/hooks";
import { Toast } from "primereact/toast";
import { RegistrationRequestsAddress } from "./components/RegistrationRequestsAddress";

export function RegistrationRequestsDetailsView() {
  const popupRef = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const { userId } = useParams<{ userId: string }>();
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingRejection, setIsLoadingRejection] = useState(false);

  const action = useMemo<string>(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get("action") || "";
    }
    return "";
  }, []);

  const [users, setUsers] = useLocalStorage<UserOutput[]>([], action);

  const user = useMemo<UserOutput | undefined>(() => {
    if (!userId || users.length === 0) return undefined;
    return users.find((user) => user.id === parseInt(userId, 10));
  }, [users, userId]);

  const confirm = (
    event: React.MouseEvent<HTMLButtonElement>,
    action: string
  ) => {
    confirmPopup({
      target: event.currentTarget as HTMLElement,
      message: `Êtes-vous sûr de vouloir ${action} cette demande ?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-danger",
      accept: async () => {
        if (action === "valider") {
          setIsLoadingApproval(true);
          try {
            await fetch(`/api/admin?action=approveAUser&userId=${userId}`);
            setUsers(
              users.map((user) => {
                if (user.id === parseInt(userId, 10)) {
                  return { ...user, isValidatedByAdmin: true };
                }
                return user;
              })
            );
            toast.current?.show({
              severity: "success",
              summary: "Succès",
              detail: "La demande a été validée avec succès.",
            });
          } catch (error) {
            toast.current?.show({
              severity: "error",
              summary: "Erreur",
              detail: "Erreur lors de la validation.",
            });
          } finally {
            setIsLoadingApproval(false);
          }
        } else {
          setIsLoadingRejection(true);
          try {
            await fetch(`/api/admin?action=unapproveUser&userId=${userId}`);
            setUsers(users.filter((user) => user.id !== parseInt(userId, 10)));
            toast.current?.show({
              severity: "success",
              summary: "Succès",
              detail: "La demande a été refusée.",
            });
            window.location.href = "/admin/registration-requests";
          } catch (error) {
            toast.current?.show({
              severity: "error",
              summary: "Erreur",
              detail: "Erreur lors du refus de la demande.",
            });
          } finally {
            setIsLoadingRejection(false);
          }
        }
      },
      reject: () => {
        console.log(`Action ${action} annulée.`);
      },
    });
  };

  return (
    <>
      <AdminPage
        title={
          <div className="flex flex-row justify-between">
            <h1>Informations détaillées sur la demande d&apos;inscription</h1>
            {user && !user.isValidatedByAdmin && (
              <div className="flex flex-row justify-between gap-2">
                <Button
                  icon="pi pi-check"
                  rounded
                  outlined
                  disabled={isLoadingApproval || isLoadingRejection}
                  loading={isLoadingApproval}
                  severity="success"
                  tooltip="Valider la demande"
                  tooltipOptions={{ position: "top" }}
                  aria-label="Valider"
                  onClick={(e) => confirm(e, "valider")}
                />
                <Button
                  icon="pi pi-times"
                  rounded
                  outlined
                  disabled={isLoadingApproval || isLoadingRejection}
                  loading={isLoadingRejection}
                  severity="danger"
                  tooltip="Refuser la demande"
                  tooltipOptions={{ position: "top" }}
                  aria-label="Refuser"
                  onClick={(e) => confirm(e, "refuser")}
                />
              </div>
            )}
          </div>
        }
      >
        {user && <RegistrationRequestsFile user={user} />}
        {user && <RegistrationRequestsAddress user={user} />}
      </AdminPage>
      <ConfirmPopup ref={popupRef} />
      <Toast ref={toast} />
    </>
  );
}
// "Informations détaillées sur la demande d'inscription"
