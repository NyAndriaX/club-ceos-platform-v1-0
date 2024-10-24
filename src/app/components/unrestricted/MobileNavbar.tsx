import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindow } from '@/app/hooks/useWindow';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { PanelMenu } from 'primereact/panelmenu';
import { motion, AnimatePresence } from 'framer-motion';

const CustomItem1 = () => (
  <div className="flex items-center gap-2 p-4 bg-blue-100 text-blue-900 rounded-lg shadow-lg">
    <i className="pi pi-file text-2xl" />
    <span>Custom Item 1</span>
  </div>
);

const CustomMenuItem: React.FC<{
  item: MenuItem;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: MenuItem,
  ) => void;
}> = ({ item, onClick }) => {
  return (
    <div className="w-full py-2 text-start border-b border-blue-900 text-blue-900">
      {item.label}
    </div>
  );
};

const MobileNavbar = () => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const { isMobile } = useWindow();
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const items: MenuItem[] = [
    {
      label: 'Custom Item 1',
      template: item => (
        <CustomMenuItem item={item} onClick={() => console.log('text')} />
      ),
      items: [
        {
          label: 'Sub Item 1',
          template: () => <CustomItem1 />,
        },
        {
          label: 'Sub Item 2',
          template: () => <CustomItem1 />,
        },
      ],
    },
    {
      label: 'Custom Item 2',
      template: item => (
        <CustomMenuItem item={item} onClick={() => console.log('texts')} />
      ),
    },
  ];

  const toggleSidebar = () => {
    if (isMenuVisible) {
      setIsMenuVisible(false);
      setTimeout(() => setVisible(false), 300);
    } else {
      setVisible(true);
      setTimeout(() => setIsMenuVisible(true), 10);
    }
  };

  return (
    <>
      <motion.nav
        className={`flex flex-col gap-4 ${
          visible ? 'absolute' : 'sticky bg-opacity-70'
        } top-0 z-50 bg-white shadow-sm px-4 py-2 w-full`}
        initial={{ height: '4rem' }}
        animate={{ height: visible ? '100vh' : '4rem' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="logo px-6" />
          {isMobile && isMenuVisible && (
            <Button
              size="small"
              label="Membres"
              outlined
              onClick={() => {
                router.push('/pages/unrestricted/login'), toggleSidebar();
              }}
            />
          )}
          <Button
            icon={isMenuVisible ? 'pi pi-times' : 'pi pi-bars'}
            size="small"
            className="relative"
            onClick={toggleSidebar}
          />
        </div>

        <AnimatePresence>
          {isMenuVisible && (
            <motion.div
              className="flex flex-col gap-4 items-start w-full mt-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4 mb-4 items-center justify-center w-full">
                <Link href="/" className="text-xl font-semibold text-blue-900">
                  Pourquoi le CDC ?
                </Link>
                <Link href="/" className="text-xl font-semibold text-blue-900">
                  Les membre du CDC
                </Link>
                <Link href="/" className="text-xl font-semibold text-blue-900">
                  Les avantages du CDC
                </Link>
              </div>
              <PanelMenu model={items} className="w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default MobileNavbar;
