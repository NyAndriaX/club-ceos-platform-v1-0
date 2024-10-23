import React from 'react';

interface AdminPageProps {
  headers?: React.ReactNode | null;
  children?: React.ReactNode;
}

const AdminPage: React.FC<AdminPageProps> = ({ children, headers }) => {
  return (
    <div className="flex flex-col w-full h-full items-start rounded-md gap-4 py-2 md:py-4 px-4 md:px-8">
      {headers && (
        <header className="text-xl md:text-2xl font-bold w-full text-gray-900">
          {headers}
        </header>
      )}
      <main
        className={`flex flex-col items-center w-full space-x-4 overflow-auto ${!headers && 'md:p-8'}`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminPage;
