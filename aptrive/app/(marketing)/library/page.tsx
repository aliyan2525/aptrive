import type { Metadata } from "next";
import LibraryExperience from "@/components/library/LibraryExperience";
import AuthenticatedLibraryWorkspace from "@/components/library/AuthenticatedLibraryWorkspace";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Library — Aptrive",
  description: "Focused practice sets, past papers, revision notes, and timed challenges for Pakistan entrance-exam preparation.",
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <AuthenticatedLibraryWorkspace /> : <LibraryExperience />;
}
