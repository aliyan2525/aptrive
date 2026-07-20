"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";

export type HeaderUser = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export default function UserMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const initials = getInitials(user.fullName || user.email);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-teal-dim text-xs font-semibold text-teal transition-colors hover:border-teal/50"
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-line bg-panel shadow-xl"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-fg">
              {user.fullName || "Student"}
            </p>
            <p className="truncate text-xs text-muted-2">{user.email}</p>
          </div>

          <div className="py-1">
            <MenuLink href="/dashboard">Dashboard</MenuLink>
            <MenuLink href="/practice">Resume practice</MenuLink>
            <MenuLink href="/leaderboard">Rankings</MenuLink>
            <MenuLink href="/profile">Profile</MenuLink>
          </div>

          <div className="border-t border-line py-1">
            <form action={signOut}>
              <button
                type="submit"
                role="menuitem"
                className="block w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block px-4 py-2 text-sm text-muted transition-colors hover:bg-panel-2 hover:text-fg"
    >
      {children}
    </Link>
  );
}

function getInitials(source: string): string {
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
