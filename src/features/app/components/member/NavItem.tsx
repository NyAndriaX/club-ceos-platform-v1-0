import React from 'react';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export const NavItem: React.FC<{
  item: MenuItem;
  isHomePage: boolean;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: MenuItem,
  ) => void;
}> = ({ item, isHomePage, onClick }) => (
  <Button
    size="small"
    severity="secondary"
    text
    className={`flex flex-row gap-4 w-full items-start text-gray-900 ${item.className}`}
    onClick={e => onClick(e, item)}
  >
    {!isHomePage && (
      <Tooltip target={`.navitem-${item.id}`} content={item.label} />
    )}
    <span
      className={`navitem-${item.id} ${item.icon}`}
      style={{ fontSize: isHomePage ? '1rem' : '1.2rem' }}
    ></span>
    {isHomePage && <span className="text-sm font-semibold">{item.label}</span>}
  </Button>
);
