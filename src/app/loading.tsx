'use client';

import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function RootLoading() {
    return <div className="flex flex-row items-center justify-center w-full h-full"><ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /></div>;
}
