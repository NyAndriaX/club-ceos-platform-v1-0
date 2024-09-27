import React, { useState } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import Link from "next/link";

export const NavBar: React.FC = () => {
    const itemRenderer = (item: MenuItem, options: any) => {
        return (
            <Link href={item.url || "#"} legacyBehavior>
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
                            className={`ml-auto ${options.active ? "pi pi-chevron-down" : "pi pi-chevron-right"
                                }`}
                        />
                    )}
                </a>
            </Link>
        );
    };

    const items: MenuItem[] = [
        {
            id: "0",
            label: "Partage et entraide CEO",
            icon: "pi pi-users",
            url: "/member/home",
            template: itemRenderer,
            items: [
                {
                    id: "0_0",
                    label: "Thematique",
                    icon: "pi pi-book",
                    url: ""
                },
                {
                    id: "0_1",
                    label: "Poser un sujet",
                    icon: "pi pi-pencil",
                    url: ""
                },
                {
                    id: "0_2",
                    label: "Trouver un meilleur",
                    icon: "pi pi-search",
                    url: "",
                },
                {
                    id: "0_3",
                    label: "Centres d'interets",
                    icon: "pi pi-heart",
                    url: ""
                },
            ],
        },
        {
            id: "1",
            label: "Masterclasses",
            icon: "pi pi-video",
            url: "/member/home",
            template: itemRenderer,
            items: [
                {
                    id: "1_0",
                    label: "Acces au replays",
                    icon: "pi pi-play",
                    url: ""
                },
                {
                    id: "1_1",
                    label: "Agenda des masterclasses",
                    icon: "pi pi-calendar",
                    url: ""
                },
                {
                    id: "1_2",
                    label: "Soumettre une intervention",
                    icon: "pi pi-send",
                    url: ""
                },
            ],
        },
        {
            id: "2",
            label: "Membres",
            icon: "pi pi-id-card",
            url: "/member/home",
            template: itemRenderer,
            items: [
                {
                    id: "2_0",
                    label: "Annuaire",
                    icon: "pi pi-bookmark",
                    url: "/member/contentMember"
                },
                {
                    id: "2_1",
                    label: "Actualites des membres",
                    icon: "pi pi-bell",
                    url: ""
                },
            ],
        },
        {
            id: "3",
            label: "Rencontres reelles",
            icon: "pi pi-calendar-plus",
            url: "/member/home",
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
            url: "/member/home",
            template: itemRenderer,
            items: [
                {
                    id: "4_0",
                    label: "Perks partenaires",
                    icon: "pi pi-briefcase",
                    url: ""
                },
            ],
        },
        {
            id: "5",
            label: "Aide",
            icon: "pi pi-info-circle",
            url: "/member/home",
            template: itemRenderer,
        },
    ];

    return (
        <div className="card flex flex-col items-center gap-3 h-screen bg-white ">
            <PanelMenu
                model={items}
                className="w-full sticky top-16 left-0 md:w-80 py-2"
            />
        </div>
    );
};
