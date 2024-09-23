import React, { useRef } from "react";
import { signOut } from "next-auth/react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const UserMenu: React.FC = () => {
  const menu = useRef<Menu>(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const items: MenuItem[] = [
    {
      label: "Déconnexion",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <Button
        icon="pi pi-bell"
        size="large"
        className="p-button-rounded p-button-text"
        aria-label="Notifications"
      />
      <Button
        icon="pi pi-cog"
        size="large"
        className="p-button-rounded p-button-text"
        aria-label="Settings"
      />
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
        className="border-2 border-gray-300 cursor-pointer transition-transform transform hover:scale-105"
        onClick={(event) => menu.current?.toggle(event)}
        aria-haspopup="true"
      />
      <Menu
        model={items}
        popup
        ref={menu}
        id="popup_menu_left"
        className="border-0 shadow-lg"
      />
    </div>
  );
};

const start = <div className="w-[40vw]">Club CEO Platforme</div>;

const searchItems: MenuItem[] = [
  {
    template: () => (
      <div className="flex items-center mx-auto border border-gray-300 rounded-lg p-1 bg-whitek">
        <InputText
          placeholder="Recherche..."
          type="text"
          className="p-inputtext-sm flex-grow border-0 focus:outline-none"
        />
        <Button
          icon="pi pi-search"
          className="p-button-outlined p-button-sm ml-1"
          aria-label="Search"
        />
      </div>
    ),
  },
];

export const TopBar: React.FC = () => {
  return (
    <Menubar
      start={start}
      end={<UserMenu />}
      model={searchItems}
      className="w-full bg-white rounded-none sticky top-0 z-50 px-4"
    />
  );
};
