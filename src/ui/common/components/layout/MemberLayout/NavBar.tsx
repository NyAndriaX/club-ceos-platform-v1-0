import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Card } from "primereact/card";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "primereact/tooltip";

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/member/home";

  const itemRenderer = (item: MenuItem, options: any) => {
    return (
      <Button
        size="small"
        severity="secondary"
        text
        className={`flex flex-row gap-4 items-start text-gray-900 font-normal ${item.className}`}
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
      id: "1",
      label: "Se déconnecter",
      icon: "pi pi-sign-out",
      className: "text-red-500",
      template: itemRenderer,
      command: async () => {
        await signOut({ callbackUrl: "/signin" });
      },
    },
  ];

  return (
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
  );
};

{
  /**
     * 
     *   const itemRenderer = (item: MenuItem, options: any) => {
      return (
        <a
          className="flex items-center px-4 py-2 border border-white"
          onClick={options.onClick}
        >
          <span className={`${item.icon} text-primary text-lg`} />
          <span className={`ml-3 text-sm ${item.items ? "font-semibold" : ""}`}>
            {item.label}
          </span>
          {item.items && (
            <span
              className={`ml-auto ${
                options.active ? "pi pi-chevron-down" : "pi pi-chevron-right"
              }`}
            />
          )}
        </a>
      );
    };
  
        const items: MenuItem[] = [
      {
        id: "0",
        label: "Partage et entraide CEO",
        icon: "pi pi-users",
        template: itemRenderer,
        items: [
          { id: "0_0", label: "Thematique", icon: "pi pi-book" },
          { id: "0_1", label: "Poser un sujet", icon: "pi pi-pencil" },
          { id: "0_2", label: "Trouver un meilleur", icon: "pi pi-search" },
          { id: "0_3", label: "Centres d'interets", icon: "pi pi-heart" },
        ],
      },
      {
        id: "1",
        label: "Masterclasses",
        icon: "pi pi-video",
        template: itemRenderer,
        items: [
          { id: "1_0", label: "Acces au replays", icon: "pi pi-play" },
          {
            id: "1_1",
            label: "Agenda des masterclasses",
            icon: "pi pi-calendar",
          },
          { id: "1_2", label: "Soumettre une intervention", icon: "pi pi-send" },
        ],
      },
      {
        id: "2",
        label: "Membres",
        icon: "pi pi-id-card",
        template: itemRenderer,
        items: [
          { id: "2_0", label: "Annuaire", icon: "pi pi-bookmark" },
          { id: "2_1", label: "Actualites des membres", icon: "pi pi-bell" },
        ],
      },
      {
        id: "3",
        label: "Rencontres reelles",
        icon: "pi pi-calendar-plus",
        template: itemRenderer,
        items: [
          { id: "3_0", label: "Seminaire annuel", icon: "pi pi-globe" },
          { id: "3_1", label: "Rencontres confidentielles", icon: "pi pi-lock" },
        ],
      },
      {
        id: "4",
        label: "Mes avantages",
        icon: "pi pi-gift",
        template: itemRenderer,
        items: [
          { id: "4_0", label: "Perks partenaires", icon: "pi pi-briefcase" },
        ],
      },
      {
        id: "5",
        label: "Aide",
        icon: "pi pi-info-circle",
        template: itemRenderer,
      },
    ];
  
  
  */
}
