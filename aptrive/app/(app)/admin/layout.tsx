import type { Metadata } from "next";
import { requireStaff } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Aptrive",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();

  return (
    <div className="min-h-screen bg-graphite">
      <AdminNav role={staff.role} />
      <main className="container-aptrive py-10">{children}</main>
    </div>
  );
}
