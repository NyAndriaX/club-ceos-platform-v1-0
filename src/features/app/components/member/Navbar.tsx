import React, { useState, useEffect } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { signOut } from 'next-auth/react';
import { Theme } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ThemeDialog } from './ThemeDialog';
import { LogoButton } from './LogoButton';
import { NavItem } from './NavItem';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoadingFetchAllThemes, setIsLoadingFetchAllThemes] =
    useState<boolean>(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const isHomePage = pathname === '/member/home';

  const accept = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  useEffect(() => {
    const fetchAllThemes = async () => {
      setIsLoadingFetchAllThemes(true);
      try {
        const response = await fetch('/api/theme');
        const { themes } = await response.json();
        setThemes(themes);
      } catch (error) {
        console.error('Erreur lors de la récupération des thèmes :', error);
      } finally {
        setIsLoadingFetchAllThemes(false);
      }
    };
    fetchAllThemes();
  }, []);

  const reject = () => {};

  const items: MenuItem[] = [
    {
      label: 'Espaces',
      icon: 'pi pi-globe',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(false)}
        />
      ),
      command: () => {
        setVisible(!visible);
      },
    },
    {
      label: 'Intérêt ',
      icon: 'pi pi-bookmark',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(false)}
        />
      ),
      command: () => {
        setVisible(false);
        router.push('/member/interest-center');
      },
    },
    {
      label: ' Membres',
      icon: 'pi pi-id-card',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(true)}
        />
      ),
      command: () => {
        setVisible(false);
        router.push('/member/members');
      },
    },
    {
      label: 'Mon compte',
      icon: 'pi pi-user',
      className: 'mt-4',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(true)}
        />
      ),
      command: () => {
        setVisible(false);
        router.push('/member/user/edit');
      },
    },
    {
      label: 'Brouillons',
      icon: 'pi pi-pen-to-square',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(true)}
        />
      ),
      command: () => {
        setVisible(false);
        router.push('/member/topic/drafts');
      },
    },
    {
      label: 'Se déconnecter',
      icon: 'pi pi-sign-out',
      className: 'text-red-500',
      template: item => (
        <NavItem
          item={item}
          isHomePage={isHomePage}
          onClick={() => setVisible(true)}
        />
      ),
      command: () => {
        setVisible(false);
        confirmDialog({
          message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          defaultFocus: 'accept',
          accept,
          reject,
        });
      },
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
          onClick={() => router.push('/member/home')}
        />
        <PanelMenu
          model={items}
          className={`flex flex-col ${isHomePage ? 'w-full' : 'w-fit'}`}
        />
      </div>
      <ThemeDialog
        visible={visible}
        onHide={() => setVisible(false)}
        positionLeft={isHomePage ? 289 : 142}
        themes={themes}
        isLoading={isLoadingFetchAllThemes}
      />
      <ConfirmDialog />
    </div>
  );
};
