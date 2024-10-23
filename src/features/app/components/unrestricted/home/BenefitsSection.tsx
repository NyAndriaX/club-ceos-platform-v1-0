import React from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-4 md:gap-20 px-4 w-full mt-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
        <div className="flex-1 w-full h-80 rounded-md relative overflow-hidden">
          <Image
            src="/austin-distel-wD1LRb9OeEo-unsplash(1).jpg"
            alt="Anonymous benefits"
            width={400}
            height={400}
            className="flex-1 w-full object-cover  h-80 rounded-md"
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-35" />
        </div>
        <div className="flex-1 flex flex-col gap-6 p-4">
          <h3 className="text-xl md:text-2xl font-semibold text-blue-900">
            Ea cupidatat irure eiusmod duis Lorem commodo Lorem incididunt.
          </h3>
          <p className="text-sm text-gray-500">
            Ex non anim ullamco duis cupidatat adipisicing ipsum. Incididunt
            adipisicing dolore quis voluptate aute commodo velit consectetur.
          </p>
          <Button size="small" label="En savoir plus" outlined />
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse gap-6 items-center justify-between w-full">
        <div className="flex-1 w-full h-80 rounded-md relative overflow-hidden">
          <Image
            src="/austin-distel-wD1LRb9OeEo-unsplash(1).jpg"
            alt="Anonymous benefits"
            width={400}
            height={400}
            className="flex-1 w-full object-cover  h-80 rounded-md"
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-35" />
        </div>

        <div className="flex-1 flex flex-col gap-6 p-4">
          <h3 className="text-xl md:text-2xl font-semibold text-blue-900">
            Ea cupidatat irure eiusmod duis Lorem commodo Lorem incididunt.
          </h3>
          <p className="text-sm text-gray-500">
            Ex non anim ullamco duis cupidatat adipisicing ipsum. Incididunt
            adipisicing dolore quis voluptate aute commodo velit consectetur.
          </p>
          <Button size="small" label="En savoir plus" outlined />
        </div>
      </div>
    </section>
  );
};
