'use client';

import { HeroSection } from '@/components/marketing/HeroSection';
import { StatsBar, FeatureGrid, HowItWorks } from '@/components/marketing/FeatureGrid';
import { PricingSection, CtaBanner } from '@/components/marketing/PricingSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeatureGrid />
      <HowItWorks />
      <PricingSection compact />
      <CtaBanner />
    </>
  );
}
