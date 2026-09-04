import type { Metadata } from "next";
import AuthenticatedLibraryWorkspace from "@/components/library/AuthenticatedLibraryWorkspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Library Workspace — Aptrive",
  description: "Your personalized study materials, revision notes, and resources.",
};

export default async function MaterialsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/materials");
  }

  return <AuthenticatedLibraryWorkspace />;
}
