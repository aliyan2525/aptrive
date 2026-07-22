"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/catalog", label: "Catalog" },
  { href: "/admin/questions", label: "Questions" },
  { href: "/admin/import", label: "Import" },
];

export default function AdminNav({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-line bg-panel">
      <div className="container-aptrive flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-lg font-semibold text-fg">
            Aptrive <span className="text-teal">Admin</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-sm px-3 py-2 text-sm transition-colors ${
                    active ? "bg-teal-dim text-fg" : "text-muted hover:bg-panel-2 hover:text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-sm border border-line-strong px-2 py-1 text-xs uppercase tracking-wide text-muted">
            {role.replace("_", " ")}
          </span>
          <Link href="/dashboard" className="text-sm text-muted hover:text-fg">
            Exit to site
          </Link>
        </div>
      </div>
    </div>
  );
}
