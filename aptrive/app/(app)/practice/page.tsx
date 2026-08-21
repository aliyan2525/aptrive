import { redirect } from "next/navigation";
import PracticeDiscovery from "@/components/practice/PracticeDiscovery";
import { createClient } from "@/lib/supabase/server";
import { listPracticeSetsForSubject, listSubjectsWithStats } from "@/lib/repositories/catalog.repository";

export default async function PracticePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/practice");

  const subjects = await listSubjectsWithStats();
  const setsBySubject = await Promise.all(
    subjects.filter((subject) => !subject.isComingSoon).map((subject) => listPracticeSetsForSubject(subject.id))
  );
  const sets = setsBySubject.flat();

  return <PracticeDiscovery sets={sets} />;
}
