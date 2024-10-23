'use client';

import React, { useState, useRef, useMemo } from 'react';
import AdminPage from '../../AdminPage';
import { Button } from 'primereact/button';
import { useParams } from 'next/navigation';
import { User } from '@prisma/client';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { RegistrationRequestsFile } from '@/app/components/admin/registration-requests/RegistrationRequestsFile';
import { useLocalStorage } from 'primereact/hooks';
import { Toast } from 'primereact/toast';
import { RegistrationRequestsAddress } from '@/app/components/admin/registration-requests/RegistrationRequestsAddress';

const RegistrationRequestsDetailsPage: React.FC = () => {
  const popupRef = useRef<any>(null);
  const toast = useRef<Toast>(null);
  const { userId } = useParams<{ userId: string }>();
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingRejection, setIsLoadingRejection] = useState(false);

  const action = useMemo<string>(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get('action') || '';
    }
    return '';
  }, []);

  const [users, setUsers] = useLocalStorage<Partial<User>[]>([], action);

  const user = useMemo<Partial<User> | undefined>(() => {
    if (!userId || users.length === 0) return undefined;
    return users.find(user => user.id === parseInt(userId, 10));
  }, [users, userId]);

  const confirm = (
    event: React.MouseEvent<HTMLButtonElement>,
    action: string,
  ) => {
    confirmPopup({
      target: event.currentTarget as HTMLElement,
      message: `Êtes-vous sûr de vouloir ${action} cette demande ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      acceptClassName: 'p-button-success',
      rejectClassName: 'p-button-danger',
      accept: async () => {
        if (action === 'valider') {
          setIsLoadingApproval(true);
          try {
            await fetch(`/api/admin?action=approveAUser&userId=${userId}`);
            setUsers(
              users.map(user => {
                if (user.id === parseInt(userId, 10)) {
                  return { ...user, isValidatedByAdmin: true };
                }
                return user;
              }),
            );
            toast.current?.show({
              severity: 'success',
              summary: 'Succès',
              detail: 'La demande a été validée avec succès.',
            });
          } catch (error) {
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la validation.',
            });
          } finally {
            setIsLoadingApproval(false);
          }
        } else {
          setIsLoadingRejection(true);
          try {
            await fetch(`/api/admin?action=unapproveUser&userId=${userId}`);
            setUsers(users.filter(user => user.id !== parseInt(userId, 10)));
            toast.current?.show({
              severity: 'success',
              summary: 'Succès',
              detail: 'La demande a été refusée.',
            });
            window.location.href = '/admin/registration-requests';
          } catch (error) {
            toast.current?.show({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du refus de la demande.',
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
      <Toast ref={toast} />
      <ConfirmPopup ref={popupRef} />
      <AdminPage
        headers={
          <div className="flex flex-row justify-between">
            <h1>Informations détaillées sur la demande d&apos;inscription</h1>
            {user && !user.isValidatedByAdmin && (
              <div className="flex flex-row justify-between gap-2">
                <Button
                  size="small"
                  icon="pi pi-check"
                  rounded
                  outlined
                  disabled={isLoadingApproval || isLoadingRejection}
                  loading={isLoadingApproval}
                  severity="success"
                  tooltip="Valider la demande"
                  tooltipOptions={{ position: 'top' }}
                  aria-label="Valider"
                  onClick={e => confirm(e, 'valider')}
                />
                <Button
                  size="small"
                  icon="pi pi-times"
                  rounded
                  outlined
                  disabled={isLoadingApproval || isLoadingRejection}
                  loading={isLoadingRejection}
                  severity="danger"
                  tooltip="Refuser la demande"
                  tooltipOptions={{ position: 'top' }}
                  aria-label="Refuser"
                  onClick={e => confirm(e, 'refuser')}
                />
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4 w-full">
          {user && <RegistrationRequestsFile user={user as User} />}
          {user && <RegistrationRequestsAddress user={user as User} />}
        </div>
      </AdminPage>
    </>
  );
};

export default RegistrationRequestsDetailsPage;
