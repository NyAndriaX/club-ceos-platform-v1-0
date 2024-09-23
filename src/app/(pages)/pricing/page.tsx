"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "primereact/card";
import { UserOutput } from "@/typings";
import { Button } from "primereact/button";
import { decryptKey } from "@/app/api/utils/crypto";

interface PlanProps {
  index: number;
  price: number;
  title: string;
  user: UserOutput | null;
  description: string;
  benefits: string[];
  buttonText: string;
  paymentLink: string;
}

const PlanCard = ({
  index,
  price,
  title,
  user,
  description,
  benefits,
  paymentLink,
  buttonText,
}: PlanProps) => {
  return (
    <Card
      className={`max-w-96 ${index % 2 === 1 ? "bg-blue-900 text-white" : ""}`}
      key={index}
      title={
        <div className="flex flex-col gap-1">
          <h1
            className={`${
              index % 2 === 1 ? "text-white" : "text-blue-900"
            } font-extrabold text-4xl`}
          >
            € {price}
          </h1>
          <div className="flex flex-row items-center justify-end gap-2 text-xs ">
            <p className="text-end font-normal w-[8vw]">
              par mois et par assistance
            </p>
            <li className="pi pi-info-circle"></li>
          </div>
        </div>
      }
      subTitle={<h1 className="text-blue-500 font-bold text-2xl">{title}</h1>}
    >
      <div className="flex flex-col items-start gap-8">
        <p className="text-base">{description}</p>
        <ul className="text-sm">
          {benefits.map((benefit, index: number) => (
            <li key={index} className="flex flex-row items-center gap-2">
              <span className="pi pi-check text-sm text-green-500"></span>
              {benefit}
            </li>
          ))}
        </ul>
        <Button
          label={buttonText}
          className="w-full"
          onClick={() =>
            window.open(
              `${paymentLink}?prefilled_email=${user?.email}`,
              "_blank"
            )
          }
        />
      </div>
    </Card>
  );
};

enum PopularPlanType {
  PasPopulaire,
  Populaire,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
  paymentLink: string;
}

const pricingList: PricingProps[] = [
  {
    title: "Petit Forfait",
    popular: PopularPlanType.PasPopulaire,
    price: 1990,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 100K€ et 500K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support basique",
      "Jusqu'à 10 membres de l'équipe",
      "Stockage limité",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_100K_500K!,
  },
  {
    title: "Gros Forfait",
    popular: PopularPlanType.Populaire,
    price: 4990,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 100K€ et 500K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support prioritaire",
      "Jusqu'à 20 membres de l'équipe",
      "Stockage étendu",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_100K_500K!,
  },
  {
    title: "Petit Forfait",
    popular: PopularPlanType.PasPopulaire,
    price: 3990,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 501K€ et 999K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support basique",
      "Jusqu'à 15 membres de l'équipe",
      "Stockage limité",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_501K_999K!,
  },
  {
    title: "Gros Forfait",
    popular: PopularPlanType.Populaire,
    price: 6990,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 501K€ et 999K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support prioritaire",
      "Jusqu'à 25 membres de l'équipe",
      "Stockage étendu",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_501K_999K!,
  },
  {
    title: "Petit Forfait",
    popular: PopularPlanType.PasPopulaire,
    price: 9900,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 1000K€ et 9000K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support basique",
      "Jusqu'à 30 membres de l'équipe",
      "Stockage limité",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_1000K_9000K!,
  },
  {
    title: "Gros Forfait",
    popular: PopularPlanType.Populaire,
    price: 12990,
    description:
      "Pour les entreprises avec un chiffre d'affaires entre 1000K€ et 9000K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support prioritaire",
      "Jusqu'à 40 membres de l'équipe",
      "Stockage étendu",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_1000K_9000K!,
  },
  {
    title: "Petit Forfait",
    popular: PopularPlanType.PasPopulaire,
    price: 9900,
    description:
      "Pour les entreprises avec un chiffre d'affaires supérieur à 10 000K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support basique",
      "Jusqu'à 50 membres de l'équipe",
      "Stockage étendu",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_SMALL_PLAN_10M_20M!,
  },
  {
    title: "Gros Forfait",
    popular: PopularPlanType.Populaire,
    price: 14990,
    description:
      "Pour les entreprises avec un chiffre d'affaires supérieur à 10 000K€.",
    buttonText: "Choisir ce forfait",
    benefitList: [
      "Support premium",
      "Jusqu'à 60 membres de l'équipe",
      "Stockage illimité",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LARGE_PLAN_SUPERIEUR_20M!,
  },
];
const Pricing = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [user, setUser] = useState<UserOutput | null>(null);
  const [_, setIsKeyValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const validateKey = async () => {
      if (!key) {
        setErrorMessage("Aucune clé fournie.");
        return;
      }

      try {
        const decryptedData = await decryptKey(key);
        if (!decryptedData) {
          throw new Error("Erreur de décryptage de la clé.");
        }

        const currentTime = Date.now();
        if (currentTime > decryptedData.expirationDate) {
          throw new Error("La clé a expiré.");
        }

        const response = await fetch(`/api/user/${decryptedData.userId}`);
        const { user: userWithResponse } = await response.json();

        if (!userWithResponse) {
          throw new Error("L'utilisateur n'existe pas.");
        }
        setUser(userWithResponse);
        setIsKeyValid(true);
        setErrorMessage(null);
      } catch (error: unknown) {
        setIsKeyValid(false);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Une erreur inconnue est survenue.");
        }
      }
    };

    validateKey();
  }, [key]);

  const revenue = useMemo<number>(() => user?.revenue ?? 0, [user]);

  const availablePrice: PricingProps[] = useMemo(() => {
    const caPricingRules = [
      { minCA: 100000, maxCA: 500000, prices: [1990, 4990] },
      { minCA: 501000, maxCA: 999000, prices: [3990, 6990] },
      { minCA: 1000000, maxCA: 9000000, prices: [9900, 12990] },
      { minCA: 10001000, maxCA: Infinity, prices: [9900, 14990] },
    ];

    const rule = caPricingRules.find(
      ({ minCA, maxCA }) => revenue >= minCA && revenue <= maxCA
    );

    return rule
      ? pricingList.filter((plan) => rule.prices.includes(plan.price))
      : [];
  }, [revenue]);

  return (
    <section className="px-4 w-full py-12">
      {errorMessage ? (
        <div className="flex flex-row justify-center items-center w-full">
          <Card className="bg-red-100 border border-red-500 text-red-700 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <span className="pi pi-exclamation-triangle mr-2 text-red-500"></span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-blue-950 leading-tight">
              Choisissez l&apos;offre qui vous correspond le mieux
            </h1>
            <h2 className="text-sm font-medium text-blue-900 leading-snug">
              Des solutions flexibles pour chaque étape de votre croissance
            </h2>
          </div>
          <div className="flex flex-row items-start gap-4">
            {availablePrice.length > 0 ? (
              revenue >= 1000000 ? (
                availablePrice
                  .slice(
                    revenue >= 10001000 ? 1 : 0,
                    revenue >= 10001000 ? availablePrice.length : -1
                  )
                  .map((availablePrice, index) => (
                    <PlanCard
                      key={index}
                      index={index}
                      user={user}
                      title={availablePrice.title}
                      price={availablePrice.price}
                      benefits={availablePrice.benefitList}
                      buttonText={availablePrice.buttonText}
                      description={availablePrice.description}
                      paymentLink={availablePrice.paymentLink}
                    />
                  ))
              ) : (
                availablePrice.map((availablePrice, index) => (
                  <PlanCard
                    key={index}
                    index={index}
                    user={user}
                    title={availablePrice.title}
                    price={availablePrice.price}
                    benefits={availablePrice.benefitList}
                    buttonText={availablePrice.buttonText}
                    description={availablePrice.description}
                    paymentLink={availablePrice.paymentLink}
                  />
                ))
              )
            ) : (
              <div className="flex flex-row justify-center items-center w-full">
                <Card className="bg-yellow-100 border border-yellow-500 text-yellow-700 rounded-lg shadow-md p-4">
                  <div className="flex items-center">
                    <span className="pi pi-exclamation-triangle mr-2 text-yellow-500"></span>
                    <span className="font-semibold">
                      Aucune offre disponible pour votre revenue
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;
