import './styles/globals.css';

import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';

export const metadata = {
  title: 'Club des CEOs - Une plateforme pour les leaders',
  description:
    "Rejoignez notre plateforme pour les dirigeants et les chefs d'entreprise. Participez à des discussions, trouvez des mentors et développez votre réseau.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="h-screen w-screen overflow-hidden">
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </body>
    </html>
  );
}
