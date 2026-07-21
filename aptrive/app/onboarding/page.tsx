import type { Metadata } from "next";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Onboarding - Aptrive",
  description: "Personalize your Aptrive dashboard, goals, and study plan.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
