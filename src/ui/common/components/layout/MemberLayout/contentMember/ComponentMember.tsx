'use client'
import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "./cardStyle.module.css";
import { Chip } from "primereact/chip";
import { Avatar } from "primereact/avatar";
import { Checkbox } from "primereact/checkbox";




type Props = {
    children: React.ReactNode;
};

export const ComponentMember = ({ children }: Props) => {
    return (
        <div>
            <ContentAnnuaire>
            </ContentAnnuaire>
        </div>
    );
};

{/**contenu pour l'espace ANNUAIRE MEMBER */ }
const ContentAnnuaire = () => {
    return (
        <div className="w-full h-screen ">
            <h1 className="text-left text-3xl text-orange-600 ">Annuaire membres</h1>
            <div className="flex ml-[170px] mr-[40px] pb-6">
                <h1 className="text-left text-3xl text-gray-900 ">Annuaire des membres</h1>
            </div>
            <div className="flex w-[80%] mx-auto border border-gray-300 rounded-lg p-1 bg-whitek
            ml-[170px] mr-[40px]"
            >
                <InputText
                    type="text" placeholder="Recherchez parmi les 1500 membres de la communauté"
                    className="p-inputtext-sm flex-grow border-0 focus:outline-none"
                />
                <Button
                    icon="pi pi-search"
                    className="p-button-outlined p-button-sm ml-1"
                    aria-label="Search"
                />
            </div>
            <div className="flex ml-[170px] mr-[40px] flex-row py-3">
                <div className="">
                    <div className="card flex flex-wrap gap-2 pt-6">
                        <Chip label="Centre d'intérets" icon="pi pi-sliders-v" />
                        <Chip label="Tous les membres" icon="pi pi-sliders-h" />
                        <div className="card flex justify-content-center mt-[0.4rem]">

                            <span>Membres avec une biographie</span>
                            <span className=""> <i className="pi pi-circle-fill text-purple-700"></i> Disponibles pour mentorat</span>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex ml-[170px] mr-[40px] flex-col">
                <div className="flex flex-row gap-2 py-2">
                    <CardProfile />
                    <CardProfile />
                    <CardProfile />
                </div>
                <div className="flex flex-row gap-2">
                    <CardProfile />
                    <CardProfile />
                    <CardProfile />
                </div>
            </div>
        </div>
    );
}

export const CardProfile = ({ profile }: any) => {

    return (
        <Card className="card-profile w-[300px] h-[300px] gap-4 ">
            <div className="profile-header pb-4">
                <img
                    src=""
                    alt=""
                    className="profile-image"
                />
                <Avatar label="V" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
                <i className=""></i>

            </div>
            <h3 className="text-lg text-gray-800">Mpandakar</h3>
            <div className="card-body ">
                <p>INgenieur en Informatique</p>
            </div>
            <div className="card-footer pt-20">
                {/**icon footbar */}
                <i className="pi pi-linkedin mx-2"></i>
                <i className="pi pi-facebook"></i>
            </div>
        </Card>
    );
};