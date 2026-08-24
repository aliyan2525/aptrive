import type { Metadata } from "next";
import SubscriptionExperience from "@/components/subscriptions/SubscriptionExperience";

export const metadata: Metadata = {
  title: "Plans — Aptrive",
  description: "Choose the Aptrive plan that fits your entrance-exam preparation: Free, Pro Monthly, or Pro Annual.",
};

export default function SubscriptionsPage() {
  return <SubscriptionExperience />;
}
