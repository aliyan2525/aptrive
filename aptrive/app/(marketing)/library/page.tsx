import type { Metadata } from "next";
import LibraryExperience from "@/components/library/LibraryExperience";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Library — Aptrive",
  description: "Focused practice sets, past papers, revision notes, and timed challenges for Pakistan entrance-exam preparation.",
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/materials");
  }

  return <LibraryExperience />;
}
