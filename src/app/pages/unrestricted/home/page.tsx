'use client';

import React from 'react';
import { BenefitsSection } from '@/app/components/unrestricted/home/BenefitsSection';
import { TeamMembersSection } from '@/app/components/unrestricted/home/TeamMembersSection';
import { HeroSection } from '@/app/components/unrestricted/home/HomeSection';
import { PartnershipLogosSection } from '@/app/components/unrestricted/home/PartnershipLogosSection';
import { TestimonialsSection } from '@/app/components/unrestricted/home/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-14">
      <HeroSection />
      <PartnershipLogosSection />
      <TeamMembersSection />
      <BenefitsSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
