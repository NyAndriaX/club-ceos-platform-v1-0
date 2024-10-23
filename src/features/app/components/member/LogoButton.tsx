import React from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export const LogoButton: React.FC<{
  isHomePage: boolean;
  onClick: () => void;
}> = ({ isHomePage, onClick }) => (
  <Button
    size="small"
    severity="secondary"
    text
    className="flex flex-row w-full gap-2 items-end justify-start text-sm text-gray-900 font-semibold cursor-pointer"
    onClick={onClick}
  >
    {!isHomePage && <Tooltip target=".title-card" content="Communautés" />}
    <span className="title-card rounded-full p-1 border border-black text-xs font-extrabold">
      Logo
    </span>
    {isHomePage ? 'Communautés' : ''}
  </Button>
);
