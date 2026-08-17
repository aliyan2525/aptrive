import type { Metadata } from "next";
import LibraryExperience from "@/components/library/LibraryExperience";

export const metadata: Metadata = {
  title: "Library — Aptrive",
  description: "Focused practice sets, past papers, revision notes, and timed challenges for Pakistan entrance-exam preparation.",
};

export default function LibraryPage() {
  return <LibraryExperience />;
}
