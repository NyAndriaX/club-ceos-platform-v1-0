import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col w-full mt-20">
      <section className="bg-blue-900 text-white py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <i className="pi pi-map-marker" style={{ fontSize: '1.2rem' }}></i>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold">Adresse :</h1>
            <p className="text-white font-light text-sm">
              Club des CEOs, marque de DGofficehub, 9 rue des colonnes 75002
              Paris
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 bg-blue-950 text-white pt-16 pb-4 px-4">
        <h1 className="text-xl md:text-2xl font-bold">Club des CEO</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <section id="contact_ceo" className="flex flex-col gap-4 p-4">
            <div className="flex flex-row gap-8 justify-between md:justify-start items-center">
              <div className="logo" />
              <h2 className="font-bold text-sm">Nous suivre</h2>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.96777984958!2d2.264633892548977!3d48.85882549164116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2smg!4v1724602040732!5m2!1sen!2smg"
              width="100%"
              height="100"
              className="rounded-md w-full md:w-[300px]"
              loading="lazy"
            ></iframe>
            <div className="flex flex-col gap-2 text-white text-center md:text-start">
              <h3 className="text-sm">Nous contacter</h3>
              <Link href="/">
                <i className="pi pi-envelope text-base font-extralight"></i>
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-white text-center md:text-start">
              <h3 className="text-sm">Nous suivre</h3>
              <div className="flex flex-row gap-4 items-center justify-center md:justify-start">
                <Link href="/">
                  <i className="pi pi-google text-base"></i>
                </Link>
                <Link href="/">
                  <i className="pi pi-facebook text-base"></i>
                </Link>
                <Link href="/">
                  <i className="pi pi-github text-base"></i>
                </Link>
              </div>
            </div>
          </section>

          <section
            id="legal"
            className="flex flex-col text-center md:text-start p-4 gap-4"
          >
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-gray-50 text-sm">
                Mentions légales
              </h2>
              <ul className="flex flex-col gap-1 text-gray-300">
                {['CGV', 'Mentions légales'].map(item => (
                  <li key={item} className="text-sm cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-1">
                <li className="text-base text-gray-50 mb-1">Partenaires</li>
                {['Mécènes', 'Partenaires'].map(item => (
                  <li
                    key={item}
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-1">
                <li className="text-sm text-gray-50 mb-1">Coin presse</li>
                {['Demande interview', 'Relation Presse'].map(item => (
                  <li
                    key={item}
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* __________________Section: Discover__________________ */}
          <section
            id="legal_and_discover"
            className="flex flex-col p-4 gap-4 text-white"
          >
            <div
              id="discover_ceo"
              className="flex flex-col justify-start items-center gap-4"
            >
              <div className="flex flex-row justify-between w-full items-center">
                <h2 className="font-bold text-sm">Découvrez le Club des CEO</h2>
                <Image src="/gift.png" alt="gift icon" width={20} height={20} />
              </div>
              <p className="text-sm font-light">
                Téléchargez l&apos;ebook - Le réseau des dirigeants transforme
                le monde
              </p>
              <Image src="/book.png" alt="ebook" width={100} height={100} />
              <form className="flex flex-col w-full gap-4">
                <div className="flex flex-col items-start gap-2 w-full">
                  <label style={{ color: 'white' }} className="text-sm w-1/5">
                    E-mail
                  </label>
                  <InputText
                    type="text"
                    placeholder="Adresse E-mail"
                    className="w-full"
                  />
                </div>
                <div className="flex align-items-center space-x-2">
                  <Checkbox checked={false} />
                  <label
                    style={{ color: 'white' }}
                    className="text-sm font-light"
                  >
                    J&apos;accepte d&apos;être recontacté à des fins
                    commerciales
                  </label>
                </div>
                <Button size="small" label="Envoyer" outlined />
              </form>
            </div>
          </section>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
