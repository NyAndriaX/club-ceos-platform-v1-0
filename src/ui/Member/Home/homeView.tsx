"use client";

import { Button } from "primereact/button";

const HomeView = () => {
    return (
        <main className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-end justify-between">
                <h2 className="text-3xl font-semibold">Bienvenue !</h2>
                <Button label="Créer un nouveau sujet" size="small" outlined />
            </div>
        </main>
    );
};

export default HomeView;
