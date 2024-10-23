import React, { useEffect, useState } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { User } from '@prisma/client';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { Badge } from 'primereact/badge';
import { useLocalStorage } from 'primereact/hooks';

export const ListApprovedUser: React.FC = () => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    revenue: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersApproved, setUsersApproved] = useState<Partial<User>[] | []>([]);
  const [, setUsersApprovedStorage] = useLocalStorage<Partial<User>[] | []>(
    [],
    'usersApproved',
  );

  useEffect(() => {
    async function getApprovedUser() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin?action=getApprovedUser');
        const { users } = await response.json();
        setUsersApproved(users);
        setUsersApprovedStorage(users);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getApprovedUser();
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      global: { ...prevFilters.global, value },
    }));
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher..."
            style={{ paddingLeft: '2rem' }}
          />
        </IconField>
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            Liste d&apos;inscription en cours de paiement
          </h2>
          <p className="text-blue-500 font-semibold mb-4 text-xs transition hover:underline">
            N.B: Veuillez sélectionner un utilisateur dont le paiement est en
            cours.
          </p>
        </div>
        <DataTable
          size="small"
          value={usersApproved}
          loading={isLoading}
          paginator
          rows={5}
          rowHover
          dataKey="id"
          className="w-full"
          header={renderHeader()}
          onRowClick={e =>
            (window.location.href = `/pages/admin/registration-requests/${e.data.id}?action=usersApproved`)
          }
          tableStyle={{ minWidth: '50rem' }}
          filters={filters}
          filterDisplay="menu"
        >
          <Column
            field="id"
            header="ID"
            filter
            filterPlaceholder="Rechercher ID"
          />
          <Column
            field="lastName"
            header="Nom"
            filter
            filterPlaceholder="Rechercher Nom"
          />
          <Column
            field="firstName"
            header="Prénom"
            filter
            filterPlaceholder="Rechercher Prénom"
          />
          <Column
            field="hasPaid"
            header="Payé"
            align="right"
            body={rowData => (
              <Badge
                value={rowData.hasPaid ? 'oui' : 'non'}
                severity={rowData.hasPaid ? 'success' : 'danger'}
              />
            )}
          />
          <Column
            field="revenue"
            header="Chiffre d'affaire"
            filter
            filterPlaceholder="Rechercher Chiffre d'affaire"
            headerClassName="flex flex-row justify-end"
            align="right"
            body={rowData => <p>{rowData.revenue} €</p>}
          />
        </DataTable>
      </div>
    </Card>
  );
};
