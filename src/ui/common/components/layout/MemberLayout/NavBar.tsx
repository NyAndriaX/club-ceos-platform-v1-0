import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Card } from "primereact/card";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "primereact/tooltip";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/member/home";

  const accept = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const reject = () => {};

  const itemRenderer = (item: MenuItem, options: any) => {
    return (
      <Button
        size="small"
        severity="secondary"
        text
        className={`flex flex-row w-full gap-4 items-start text-gray-900 font-normal ${item.className}`}
      >
        {!isHomePage ? (
          <Tooltip target={`.navitem-${item.id}`} content={item.label} />
        ) : (
          ""
        )}
        <span
          className={`navitem-${item.id} ${item.icon}`}
          style={{ fontSize: isHomePage ? "1.2rem" : "1.3rem" }}
        ></span>
        {isHomePage ? <span className="text-base">{item.label}</span> : ""}
      </Button>
    );
  };

  const items: MenuItem[] = [
    {
      id: "0",
      label: "Mon compte",
      icon: "pi pi-user",
      template: (item, options) => itemRenderer(item, options),
      command: () => router.push("/member/users/edit"),
    },
    {
      id: "2",
      label: " Membres",
      icon: "pi pi-id-card",
      template: itemRenderer,
      command: () => {
        router.push("/member/members");
      },
    },
    {
      id: "8",
      label: "Se déconnecter",
      icon: "pi pi-sign-out",
      className: "text-red-500 mt-5",
      template: itemRenderer,
      command: () => {
        confirmDialog({
          message: "Êtes-vous sûr de vouloir vous déconnecter ?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          defaultFocus: "accept",
          accept,
          reject,
        });
      },
    },
  ];

  return (
    <>
      <ConfirmDialog />
      <Card
        title={
          <Button
            size="small"
            severity="secondary"
            text
            className="flex flex-row gap-4 items-end justify-center text-2xl text-gray-800 font-semibold cursor-pointer"
            onClick={() => router.push("/member/home")}
          >
            {!isHomePage ? (
              <Tooltip target={`.title-card`} content="Communautés" />
            ) : (
              ""
            )}
            <span className="title-card rounded-full p-1 border border-black text-xs font-extrabold">
              Logo
            </span>
            {isHomePage ? "Communautés" : ""}
          </Button>
        }
        className="sticky top-0 h-screen bg-white"
      >
        <PanelMenu
          model={items}
          className={`flex flex-col gap-2 w-full mt-6 ${
            isHomePage ? "px-4" : "px-2"
          }`}
        />
      </Card>
    </>
  );
};
