import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';

export const MobileNavbar: React.FC = () => {
  const router = useRouter();

  const items: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => router.push('/pages/member/user/edit'),
    },
    {
      label: 'Sujets',
      icon: 'pi pi-folder',
      command: () => router.push('/pages/member/home'),
    },
    {
      label: 'Poster',
      icon: 'pi pi-plus',
      command: () => router.push('/pages/member/topic'),
    },
    {
      label: 'Intérêt',
      icon: 'pi pi-bookmark',
      command: () => router.push('/pages/member/interest-center'),
    },
    {
      label: 'Parcourir',
      icon: 'pi pi-list',
      command: () => router.push('/pages/member/categories'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-row items-center justify-between gap-4 px-4 py-2 bg-white shadow-md z-50">
      {items.length > 0 &&
        items.map((item, index: number) => (
          <Button
            text
            size="small"
            key={index}
            className="flex flex-col text-gray-500 items-center gap-2 w-full transition-colors duration-200"
            aria-label={item.label}
            onClick={e =>
              item.command && item.command({ originalEvent: e, item })
            }
          >
            <span className={`${item.icon} text-xl md:text-2xl`}></span>
            <span className="text-sm md:text-base">{item.label}</span>
          </Button>
        ))}
    </div>
  );
};
