import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserOutput } from "@/typings";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";
import { Badge } from "primereact/badge";
import { useLocalStorage } from "primereact/hooks";
import { ProgressSpinner } from "primereact/progressspinner";

export function ListUsersAwaitingApproval() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersAwaitingApprovals, setUsersAwaitingApprovals] = useState<
    UserOutput[] | []
  >([]);
  const [, setUsersAwaitingApproval] = useLocalStorage<UserOutput[] | []>(
    [],
    "usersAwaitingApproval"
  );

  const onCarouselClick = (userId: number) => {
    window.location.href = `/admin/registration-requests/${userId}?action=usersAwaitingApproval`;
  };

  useEffect(() => {
    async function getUsersAwaitingApproval() {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/admin?action=getUsersAwaitingApproval"
        );
        const { users } = await response.json();

        setUsersAwaitingApprovals(users);
        setUsersAwaitingApproval(users);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getUsersAwaitingApproval();
  }, []);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const cardUsersTemplate = (
    usersAwaitingApprovals: UserOutput,
    onCarouselClick: (userId: number) => void
  ) => {
    return (
      <div
        className="relative flex flex-col border surface-border border-round rounded-md m-2 text-center py-5 px-3 max-w-[300px] transition hover:bg-gray-100 cursor-pointer"
        onClick={() => onCarouselClick(usersAwaitingApprovals.id)}
      >
        <div className="flex flex-col items-center justify-center mb-3">
          <Image
            src="/profil.jpeg"
            alt="anonymous profil"
            width={200}
            height={200}
            className="h-20 w-20 shadow-sm object-cover rounded-full"
          />
          <h4 className="mb-1 mt-4 font-normal">
            Nom : {usersAwaitingApprovals.lastName}{" "}
            {usersAwaitingApprovals.firstName}.
          </h4>
          <h6>Chiffre d&apos;affaire : {usersAwaitingApprovals.revenue} €.</h6>
          {usersAwaitingApprovals.isNew && (
            <Badge
              severity="danger"
              value="nouveau"
              className="absolute -top-2 -right-6 z-50"
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <Card>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">
            Liste d&apos;inscription en attente de validation
          </h2>
          <p className="text-blue-500 font-semibold mb-4 text-xs transition hover:underline">
            N.B: Veuillez sélectionner un utilisateur dont la validation est en
            attente.
          </p>
        </div>

        {isLoading ? (
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="4"
            fill="var(--surface-ground)"
          />
        ) : (
          <Carousel
            value={usersAwaitingApprovals ?? []}
            numScroll={1}
            numVisible={3}
            responsiveOptions={responsiveOptions}
            itemTemplate={(usersAwaitingApprovals) =>
              cardUsersTemplate(usersAwaitingApprovals, onCarouselClick)
            }
          />
        )}
      </div>
    </Card>
  );
}
