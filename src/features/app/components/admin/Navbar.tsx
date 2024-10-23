import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { LogoButton } from './LogoButton';
import { NavItem } from './NavItem';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/admin/home';

  const accept = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  const reject = () => {};

  const items: MenuItem[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => router.push('/admin/home')}
        />
      ),
    },
    {
      label: 'Inscriptions',
      icon: 'pi pi-user-plus',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => router.push('/admin/registration-requests')}
        />
      ),
    },
    {
      label: 'Thématiques',
      icon: 'pi pi-comments',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => router.push('/admin/thematic')}
        />
      ),
    },
    {
      label: 'Type',
      icon: 'pi pi-info-circle',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => router.push('/admin/topic/type')}
        />
      ),
    },
    {
      label: 'Se déconnecter',
      icon: 'pi pi-sign-out',
      className: 'text-red-500 mt-4',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() =>
            confirmDialog({
              message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              defaultFocus: 'accept',
              accept,
              reject,
            })
          }
        />
      ),
    },
  ];

  return (
    <div
      style={{ width: isHomePage ? `22.5rem` : '10rem' }}
      className="relative rounded-md"
    >
      <div
        className={`flex flex-col fixed gap-8 h-full w-fit ${isHomePage && 'min-w-72'} py-4 px-8 bg-white shadow-md rounded-md z-50 items-center`}
      >
        <LogoButton
          isHomePage={isHomePage}
          onClick={() => router.push('/admin/home')}
        />
        <PanelMenu
          model={items}
          className={`flex flex-col ${isHomePage ? 'w-full' : 'w-fit'}`}
        />
      </div>
      <ConfirmDialog />
    </div>
  );
};
