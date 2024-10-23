import React from 'react';
import { Avatar } from 'primereact/avatar';

export const CardTestimonial: React.FC = () => {
  return (
    <div className="relative flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white border border-gray-200">
      <Avatar
        image="/profil.jpeg"
        size="xlarge"
        shape="circle"
        className="border-4 border-white shadow-lg"
      />
      <div className="flex flex-col justify-between w-full mt-0">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 10V7a5 5 0 015-5h1a1 1 0 010 2h-1a3 3 0 00-3 3v3a3 3 0 013 3v4a1 1 0 01-2 0v-4a1 1 0 00-1-1H8a1 1 0 010-2h1zM16 10V7a5 5 0 015-5h1a1 1 0 010 2h-1a3 3 0 00-3 3v3a3 3 0 013 3v4a1 1 0 01-2 0v-4a1 1 0 00-1-1h-1a1 1 0 010-2h1z"></path>
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl text-blue-900 font-semibold">
            Sint id et sunt esse.
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dolore officia aliquip aliqua nisi do velit do exercitation deserunt
            nostrud mollit culpa nostrud labore.
          </p>
        </div>

        <div className="mt-4">
          <a
            className="text-blue-600 hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le profil LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};
