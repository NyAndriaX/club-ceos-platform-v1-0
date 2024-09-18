"use client";

import Link from "next/link";
import { Card } from "primereact/card";

enum PopularPlanType {}

interface PricingProps {
  title: string;
}

const pricingList = [];

const Pricing = () => {
  return (
    <section className="container mx-4">
      <div className="flex flex-row items-start gap-4">
        <Card
          className="min-w-96"
          title={
            <div className="flex flex-col gap-1">
              <h1 className="text-blue-950 font-extrabold text-4xl">€ 99,90</h1>
              <div className="flex flex-row items-center justify-end gap-2 text-xs ">
                <p className="text-end font-normal w-[8vw]">
                  par mois et par assistance
                </p>
                <li className="pi pi-info-circle"></li>
              </div>
            </div>
          }
          subTitle={
            <h1 className="text-blue-900 font-bold text-2xl">SOCIETE</h1>
          }
        >
          <p></p>
        </Card>
        <Card className="min-w-80 bg-blue-900"></Card>
      </div>
    </section>
  );
};

export default Pricing;
