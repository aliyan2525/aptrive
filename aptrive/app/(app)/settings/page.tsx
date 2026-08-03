import SettingsClient from "@/components/settings/SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Aptrive",
  description: "Manage your Aptrive account settings and study preferences.",
};

export default function SettingsPage() {
  return (
    <div className="py-6 sm:py-8">
      <SettingsClient />
    </div>
  );
}
