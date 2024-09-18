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
        <Card className="min-w-80"></Card>
        <Card className="min-w-80 bg-blue-900"></Card>
      </div>
    </section>
  );
};

export default Pricing;
