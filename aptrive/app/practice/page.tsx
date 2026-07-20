import type { Metadata } from "next";
import PracticeInterface from "@/components/practice/PracticeInterface";

export const metadata: Metadata = {
  title: "Practice Session - Aptrive",
  description: "A premium computer-based testing practice interface for admission preparation.",
};

export default function PracticePage() {
  return <PracticeInterface />;
}
