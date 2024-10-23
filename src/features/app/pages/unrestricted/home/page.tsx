'use client';

import React from 'react';
import { BenefitsSection } from '@/features/app/components/unrestricted/home/BenefitsSection';
import { TeamMembersSection } from '@/features/app/components/unrestricted/home/TeamMembersSection';
import { HeroSection } from '@/features/app/components/unrestricted/home/HomeSection';
import { PartnershipLogosSection } from '@/features/app/components/unrestricted/home/PartnershipLogosSection';
import { TestimonialsSection } from '@/features/app/components/unrestricted/home/TestimonialsSection';

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
