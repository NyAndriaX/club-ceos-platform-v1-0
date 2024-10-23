import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { MenuOptions } from './MenuOptions';

const Navbar: React.FC = () => {
  const router = useRouter();
  return (
    <nav className="flex flex-col gap-1 sticky top-0 z-50 bg-white bg-opacity-70 shadow-sm px-4 py-2 w-full">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="logo" />
        <Button size="small" label="Accessibilité" outlined />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <MenuOptions />
        <div className="flex flex-row gap-4 items-center bg-blue-900 font-semibold px-8 py-3 rounded-md">
          <Link href={'/'} className="text-white text-sm hover:underline">
            Pourquoi le CDC ?
          </Link>
          <Link href={'/'} className="text-white text-sm hover:underline">
            Les avantages du CDC
          </Link>
          <Link href={'/'} className="text-white text-sm hover:underline">
            Les membre du CDC
          </Link>
        </div>
        <Button
          size="small"
          outlined
          label="Adhérer"
          onClick={() => router.push('/pages/unrestricted/signup')}
        />
      </div>
    </nav>
  );
};

export default Navbar;
