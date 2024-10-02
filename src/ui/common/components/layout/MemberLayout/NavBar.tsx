import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { Card } from "primereact/card";
import { signOut } from "next-auth/react";
import { Dialog } from "primereact/dialog";
import { ThemeOutput } from "@/typings/theme";
import { Badge } from "primereact/badge";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "primereact/tooltip";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const getRandomDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60;
  const lightness = Math.floor(Math.random() * 30) + 40;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoadingFetchAllThemes, setIsLoadingFetchAllThemes] =
    useState<boolean>(false);
  const [themes, setThemes] = useState<ThemeOutput[] | []>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [positionLeft, setPositionLeft] = useState<number>(0);

  const isHomePage = pathname === "/member/home";

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: MenuItem
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPositionLeft(rect.left + (isHomePage ? 262 : 83));
    setVisible(true);
  };

  const accept = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  useEffect(() => {
    const fetchAllThemes = async () => {
      setIsLoadingFetchAllThemes(true);
      try {
        const response = await fetch("/api/theme");
        const { themes } = await response.json();
        setThemes(themes);
      } catch (error) {
        console.error("Erreur lors de la récupération des thèmes :", error);
      } finally {
        setIsLoadingFetchAllThemes(false);
      }
    };
    fetchAllThemes();
  }, []);

  const reject = () => {};

  const itemRenderer = (item: MenuItem) => {
    return (
      <Button
        size="small"
        severity="secondary"
        text
        className={`flex flex-row gap-4 w-full items-start text-gray-900 font-normal ${item.className}`}
        onClick={(e) => handleClick(e, item)}
      >
        {!isHomePage && (
          <Tooltip target={`.navitem-${item.id}`} content={item.label} />
        )}
        <span
          className={`navitem-${item.id} ${item.icon}`}
          style={{ fontSize: isHomePage ? "1.2rem" : "1.3rem" }}
        ></span>
        {isHomePage && <span className="text-base">{item.label}</span>}
      </Button>
    );
  };

  const items: MenuItem[] = [
    {
      id: "0",
      label: "Mon compte",
      icon: "pi pi-user",
      template: itemRenderer,
      command: () => {
        setVisible(false);
        router.push("/member/users/edit");
      },
    },
    {
      id: "4",
      label: "Brouillons",
      icon: "pi pi-pen-to-square",
      template: itemRenderer,
      command: () => {
        setVisible(false);
        router.push("/member/topics/drafts");
      },
    },
    {
      separator: true,
    },
    {
      id: "5",
      label: "Centres d'intérêt ",
      icon: "pi pi-bookmark",
      template: itemRenderer,
      command: () => {
        setVisible(false);
        router.push("/member/interest-center");
      },
    },
    {
      id: "2",
      label: " Membres",
      icon: "pi pi-id-card",
      template: itemRenderer,
      command: () => {
        setVisible(false);
        router.push("/member/members");
      },
    },
    {
      id: "3",
      label: "Espaces",
      icon: "pi pi-list",
      template: itemRenderer,
      command: () => {
        setVisible(!visible);
      },
    },

    {
      separator: true,
    },
    {
      id: "8",
      label: "Se déconnecter",
      icon: "pi pi-sign-out",
      className: "text-red-500",
      template: itemRenderer,
      command: () => {
        setVisible(false);
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
      {visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setVisible(false)}
        />
      )}

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        showHeader={false}
        position="left"
        style={{
          left: `${positionLeft}px`,
          height: "125vh",
        }}
        modal={false}
        draggable={false}
        resizable={false}
        className={`absolute -top-3 z-50 shadow-sm max-h-[125vh] max-w-[300px]`}
      >
        <div className="flex flex-col gap-8 items-start py-16 text-gray-900">
          <div className="flex flex-col gap-4 items-start">
            <h2 className="text-lg font-semibold">Espaces</h2>
            <div className="flex flex-col gap-4 bg-gray-50 p-2 rounded-md">
              <p className="text-sm font-semibold text-gray-500">
                Participez à la communauté
              </p>
              <Link
                className="flex font-normal flex-row gap-2 w-fit items-center border-b border-gray-900"
                href={"/member/topics/new"}
                onClick={() => setVisible(false)}
              >
                <span>Nouveau sujet </span>
                <span
                  className="pi pi-arrow-right text-gray-500"
                  style={{ fontSize: "0.8rem" }}
                ></span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-start">
            {themes.map((theme, index: number) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <Badge style={{ backgroundColor: getRandomDarkColor() }} />
                <span>{theme.title}</span>
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      <Card
        title={
          <Button
            size="small"
            severity="secondary"
            text
            className="flex flex-row w-full gap-4 items-end justify-center text-2xl text-gray-800 font-semibold cursor-pointer"
            onClick={() => {
              setVisible(false);
              router.push("/member/home");
            }}
          >
            {!isHomePage && (
              <Tooltip target={`.title-card`} content="Communautés" />
            )}
            <span className="title-card rounded-full p-1 border border-black text-xs font-extrabold">
              Logo
            </span>
            {isHomePage ? "Communautés" : ""}
          </Button>
        }
        className="sticky top-0 h-full z-50 bg-white"
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
