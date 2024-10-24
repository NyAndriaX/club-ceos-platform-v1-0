import React from 'react';
import Link from 'next/link';
import { Badge } from 'primereact/badge';
import { Theme } from '@prisma/client';
import { ProgressSpinner } from 'primereact/progressspinner';

export const ThemeDialog: React.FC<{
  visible: boolean;
  onHide: () => void;
  positionLeft: number;
  themes: Theme[];
  isLoading: boolean;
}> = ({ visible, onHide, positionLeft, themes, isLoading }) => (
  <div className={`relative ${visible ? 'flex' : 'hidden'}`}>
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={onHide}
    />
    <div
      className="fixed bg-white z-50 h-full rounded-md max-w-80"
      style={{ left: `${positionLeft}px` }}
    >
      <div className="flex flex-col gap-8 items-start py-8 px-6 text-gray-900">
        <div className="flex flex-col gap-8 items-start w-full">
          <h2 className="text-lg font-semibold">Espaces</h2>
          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-md w-full shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Participez à la communauté
            </p>
            <Link
              className="flex items-center text-sm font-bold gap-2 w-fit border-b border-gray-900 pb-1"
              href="/pages/member/topic"
              onClick={onHide}
            >
              <span>Nouveau sujet</span>
              <span
                className="pi pi-arrow-right text-gray-500"
                style={{ fontSize: '0.8rem' }}
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start w-full">
          {isLoading ? (
            <div className="flex justify-center w-full">
              <ProgressSpinner
                style={{ width: '20px', height: '20px' }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          ) : themes && themes.length > 0 ? (
            themes.map((theme, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-sm text-gray-900 font-semibold"
              >
                <Badge />
                <span>{theme.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucun thème disponible.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
