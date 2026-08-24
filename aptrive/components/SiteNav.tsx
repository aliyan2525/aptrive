"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, ArrowUpRight, Menu, X } from "lucide-react";
import UserMenu, { type HeaderUser } from "@/components/UserMenu";
import Button from "@/components/ui/Button";
import NotificationBell, { type NotificationItem } from "@/components/NotificationBell";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
};

const publicLinks: NavItem[] = [
  { href: "/", label: "Home", match: (path) => path === "/" },
  { href: "/library", label: "Library", match: (path) => path.startsWith("/library") },
];

const authLinks: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", match: (path) => path.startsWith("/dashboard") },
  { href: "/practice", label: "Practice", match: (path) => path.startsWith("/practice") },
  { href: "/library", label: "Library", match: (path) => path.startsWith("/library") },
  { href: "/leaderboard", label: "Rankings", match: (path) => path.startsWith("/leaderboard") },
];

const toolsMenu = [
  { href: "/tools/calculator", label: "Aggregate Calculator" },
  { href: "/tools/estimator", label: "Merit Estimator" },
];

const aboutMenu = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blogs" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteNav({
  user,
  notifications = [],
  unreadCount = 0,
}: {
  user: HeaderUser | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const visibleLinks = useMemo(() => (user ? authLinks : publicLinks), [user]);
  const plansActive = pathname.startsWith("/subscriptions");
  const toolsActive = pathname.startsWith("/tools");
  const aboutActive = pathname.startsWith("/about")
    || pathname.startsWith("/contact")
    || pathname.startsWith("/blog")
    || pathname.startsWith("/privacy")
    || pathname.startsWith("/terms");

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("mobile-scroll-lock");
    } else {
      document.body.classList.remove("mobile-scroll-lock");
    }
    return () => {
      document.body.classList.remove("mobile-scroll-lock");
    };
  }, [mobileOpen]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);

    if (mobileOpen) {
      lastY.current = latest;
      return;
    }

    if (latest < 80) {
      setHidden(false);
    } else if (latest > lastY.current + 4) {
      setHidden(true);
    } else if (latest < lastY.current - 4) {
      setHidden(false);
    }
    lastY.current = latest;
  });

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-out pt-3 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex w-[calc(100%-1.5rem)] max-w-[1340px] items-center gap-3 rounded-full border border-white/80 bg-white/82 px-3 py-2 shadow-[0_12px_34px_rgba(20,32,70,0.09)] backdrop-blur-2xl transition-all duration-500 sm:px-4 lg:gap-5">
          <div className="flex w-full items-center justify-between gap-5">
            <Link href={user ? "/dashboard" : "/"} className="group flex items-center gap-2" aria-label="Aptrive">
              <div className="relative">
                <Image src="/logo-mark.png" alt="" width={30} height={34} priority className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-teal/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <span className="font-display text-lg font-bold tracking-[-0.025em] text-fg transition-colors duration-300">Aptrive</span>
            </Link>

            <nav className="relative hidden items-center lg:flex" aria-label="Main">
              {visibleLinks.map((link) => {
                const isActive = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-1.5 text-sm font-medium transition-colors text-muted hover:text-fg"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}

              <div className="group relative px-1">
                <button type="button" className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold transition-colors ${toolsActive ? "text-fg" : "text-muted hover:text-fg"}`}
>
                  Tools
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+12px)] w-56 -translate-x-1/2 rounded-2xl border border-line bg-white/95 p-2 opacity-0 shadow-2xl backdrop-blur-3xl transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:top-full group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:top-full group-focus-within:opacity-100">
                  {toolsMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-all hover:bg-slate-900/[0.04] hover:text-fg hover:pl-5">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="group relative px-1">
                <button type="button" className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-sm font-semibold transition-colors ${aboutActive ? "text-fg" : "text-muted hover:text-fg"}`}>
                  About
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+12px)] w-56 -translate-x-1/2 rounded-2xl border border-line bg-white/95 p-2 opacity-0 shadow-2xl backdrop-blur-3xl transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:top-full group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:top-full group-focus-within:opacity-100">
                  {aboutMenu.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-all hover:bg-slate-900/[0.04] hover:text-fg hover:pl-5">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <NotificationBell
                    key={`${unreadCount}:${notifications.map((n) => n.id).join(",")}`}
                    initialNotifications={notifications}
                    initialUnreadCount={unreadCount}
                  />
                  <UserMenu user={user} />
                </>
              ) : (
                <>
                  <Link href="/subscriptions" aria-current={plansActive ? "page" : undefined} className={`hidden rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:inline-flex ${plansActive ? "bg-violet-500/10 text-violet-700" : "text-muted hover:text-fg"}`}>
                    Plans
                  </Link>
                  <Button href="/login" variant="ghost" size="sm" ripple={false} className="hidden sm:inline-flex text-fg hover:bg-black/5">
                    Login
                  </Button>
                  <Link href="/signup" className="hidden h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.24)] transition-transform hover:scale-[1.02] sm:inline-flex">
                    Start diagnostic <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </>
              )}

              <button
                type="button"
                className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-fg lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() =>
                  setMobileOpen((open) => {
                    const next = !open;
                    if (next) setHidden(false);
                    return next;
                  })
                }
              >
                {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="mobile-nav" 
            className="fixed inset-0 top-[4.25rem] z-40 h-[100dvh] overflow-y-auto overscroll-contain bg-white/95 pb-[calc(6rem+env(safe-area-inset-bottom))] backdrop-blur-2xl lg:hidden"
          >
            <nav className="container-aptrive flex flex-col gap-1 py-6" aria-label="Mobile">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-4 text-base font-medium transition-colors duration-200 ${
                    link.match(pathname) ? "bg-black/5 text-black dark:bg-white/10 dark:text-white" : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                  aria-current={link.match(pathname) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 space-y-3 border-t border-black/10 dark:border-white/10 pt-6">
                {!user ? (
                  <>
                    <Link href="/subscriptions" onClick={() => setMobileOpen(false)} className={`rounded-xl border px-4 py-4 text-base font-medium transition-colors ${plansActive ? "border-violet-300 bg-violet-50 text-violet-700" : "border-black/10 text-black/60 hover:bg-black/5"}`}>
                      Plans
                    </Link>
                    <Button href="/login" variant="outline" size="md" fullWidth onClick={() => setMobileOpen(false)}>
                      Login
                    </Button>
                    <Button href="/signup" variant="primary" size="md" fullWidth onClick={() => setMobileOpen(false)} className="bg-black text-white dark:bg-white dark:text-black">
                      Start diagnostic
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-3 text-center text-xs text-black/60 dark:text-white/60">
                      Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-3 text-center text-xs text-black/60 dark:text-white/60">
                      Profile
                    </Link>
                    <Link href="/leaderboard" onClick={() => setMobileOpen(false)} className="rounded-xl bg-black px-3 py-3 text-center text-xs font-semibold text-white dark:bg-white dark:text-black">
                      Rankings
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

