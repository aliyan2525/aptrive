"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Bell, CircleHelp, Keyboard, LogOut, MessageSquare, Palette, ShieldCheck, UserRound } from "lucide-react";
import { signOut } from "@/app/(marketing)/auth/actions";
import type { HeaderUser } from "@/components/UserMenu";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthAccountMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const initials = getInitials(user.fullName || user.email);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => firstItemRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group flex items-center gap-3 rounded-full border border-white/40 bg-white/50 backdrop-blur-md p-1 pr-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(46,39,97,0.03)] transition-all hover:bg-white/70 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_6px_24px_rgba(46,39,97,0.06)] hover:border-white/60"
      >
        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-sm font-bold text-white shadow-[0_12px_24px_rgba(16,185,129,0.22)]">
          {user.avatarUrl ? <Image src={user.avatarUrl} alt="" fill className="object-cover" /> : initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-32 truncate text-sm font-bold text-[#111a3a]">{user.fullName || "Student"}</span>
          <span className="block text-xs font-semibold text-emerald-500">Pro Plan</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            className="absolute right-0 top-[calc(100%+12px)] z-[80] w-80 origin-top-right overflow-hidden rounded-[1.2rem] border border-white/70 bg-white/90 shadow-[0_28px_90px_rgba(16,28,66,0.22)] backdrop-blur-3xl"
          >
            <div className="border-b border-[#e7ecf8] bg-gradient-to-br from-white to-[#f4f7ff] p-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-sm font-bold text-white">
                {user.avatarUrl ? <Image src={user.avatarUrl} alt="" fill className="object-cover" /> : initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#111a3a]">{user.fullName || "Student"}</p>
                <p className="truncate text-xs font-semibold text-[#657199]">{user.email}</p>
                <p className="mt-1 text-xs font-bold text-emerald-500">Aptrive Pro</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            {user.isStaff && (
              <MenuLink ref={firstItemRef} href="/admin" icon={ShieldCheck} className="mb-1 bg-violet-50 text-violet-700 hover:bg-violet-100">
                Switch to Admin
              </MenuLink>
            )}
            <MenuLink ref={!user.isStaff ? firstItemRef : null} href="/profile" icon={UserRound}>Edit profile</MenuLink>
            <MenuLink href="/profile" icon={Bell}>Notifications</MenuLink>
            <MenuLink href="/profile" icon={Palette}>Appearance settings</MenuLink>
            <MenuLink href="/dashboard" icon={Keyboard}>Keyboard shortcuts</MenuLink>
            <MenuLink href="/profile" icon={CircleHelp}>Help & Support</MenuLink>
            <MenuLink href="/profile" icon={MessageSquare}>Feedback</MenuLink>
          </div>
          <form action={signOut} className="border-t border-[#e7ecf8] p-2">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-[0.85rem] px-3 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MenuLink = forwardRef<HTMLAnchorElement, {
  href: string;
  icon: typeof UserRound;
  className?: string;
  children: React.ReactNode;
}>(function MenuLink({
  href,
  icon: Icon,
  className,
  children,
}, ref) {
  return (
    <Link
      ref={ref}
      href={href}
      role="menuitem"
      className={`flex items-center gap-3 rounded-[0.85rem] px-3 py-3 text-sm font-bold transition focus:outline-none ${className || "text-[#263457] hover:bg-[#f1f5ff] focus:bg-[#f1f5ff]"}`}
    >
      <Icon className={`h-4 w-4 ${className ? "" : "text-blue-600"}`} aria-hidden="true" />
      {children}
    </Link>
  );
});

function getInitials(source: string): string {
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
