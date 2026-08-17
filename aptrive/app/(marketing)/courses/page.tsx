import type { Metadata } from "next";
import CoursesExperience from "@/components/courses/CoursesExperience";

export const metadata: Metadata = {
  title: "Courses & University Paths | Aptrive",
  description: "Choose a target university and build a focused entrance-exam preparation path with Aptrive.",
};

export default function CoursesPage() {
  return <CoursesExperience />;
}
