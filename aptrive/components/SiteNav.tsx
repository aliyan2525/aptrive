"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, ChevronDown, LayoutDashboard, LibraryBig, Trophy, UserRound } from "lucide-react";
import UserMenu, { type HeaderUser } from "@/components/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
};

const publicLinks: NavItem[] = [
  { href: "/", label: "Home", match: (path) => path === "/" },
  { href: "/library", label: "Library", match: (path) => path.startsWith("/library") },
  { href: "/leaderboard", label: "Rankings", match: (path) => path.startsWith("/leaderboard") },
  { href: "/courses", label: "Courses", match: (path) => path.startsWith("/courses") },
  { href: "/calculator", label: "Calculator", match: (path) => path.startsWith("/calculator") },
];

const authLinks: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", match: (path) => path.startsWith("/dashboard") },
  { href: "/practice", label: "Practice", match: (path) => path.startsWith("/practice") },
  { href: "/library", label: "Library", match: (path) => path.startsWith("/library") },
  { href: "/leaderboard", label: "Rankings", match: (path) => path.startsWith("/leaderboard") },
  { href: "/courses", label: "Courses", match: (path) => path.startsWith("/courses") },
  { href: "/calculator", label: "Calculator", match: (path) => path.startsWith("/calculator") },
];

const aboutMenu = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blogs" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

function navLinkClass(active: boolean) {
  return active
    ? "relative text-sm font-semibold text-fg after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-teal after:content-['']"
    : "relative text-sm text-muted transition-colors hover:text-fg after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-teal after:transition-all after:duration-300 after:[transition-timing-function:var(--ease-smooth)] after:content-[''] hover:after:w-full";
}

export default function SiteNav({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const visibleLinks = useMemo(() => (user ? authLinks : publicLinks), [user]);
  const aboutActive = pathname.startsWith("/about")
    || pathname.startsWith("/contact")
    || pathname.startsWith("/blog")
    || pathname.startsWith("/careers")
    || pathname.startsWith("/privacy")
    || pathname.startsWith("/terms");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function update() {
      const y = window.scrollY;
      setScrolled(y > 8);

      if (mobileOpen) {
        lastY.current = y;
        return;
      }

      if (y < 80) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }
      lastY.current = y;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-line/70 bg-graphite/70 transition-transform duration-300 backdrop-blur-xl [transition-timing-function:var(--ease-smooth)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className={`container-aptrive flex h-16 items-center justify-between ${scrolled ? "h-[62px]" : ""}`}>
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5" aria-label="Aptrive">
            <Image src="/logo-mark.png" alt="" width={34} height={38} priority className="h-9 w-auto" />
            <span className="font-display text-lg font-semibold tracking-tight text-fg">Aptrive</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Main">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(link.match(pathname))}
                aria-current={link.match(pathname) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="group relative">
              <button type="button" className={`inline-flex items-center gap-1.5 ${navLinkClass(aboutActive)}`}>
                About
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="pointer-events-none invisible absolute right-0 top-[calc(100%+12px)] w-52 rounded-xl border border-line bg-panel/95 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                {aboutMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-panel-2 hover:text-fg">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  href="/dashboard"
                  variant="ghost"
                  size="icon"
                  ripple={false}
                  aria-label="Notifications"
                  className="hidden border border-line hover:border-teal/40 sm:inline-flex"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost" size="sm" ripple={false} className="hidden sm:inline-flex">
                  Login
                </Button>
                <Button href="/signup" variant="primary" size="sm" className="hidden sm:inline-flex">
                  Create account
                </Button>
              </>
            )}

            <button
              type="button"
              className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
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
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div id="mobile-nav" className="fixed inset-0 top-16 z-40 bg-graphite/95 backdrop-blur md:hidden">
          <nav className="container-aptrive flex animate-[enter-up_0.28s_ease_both] flex-col gap-1 py-6" aria-label="Mobile">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3 py-3 text-base transition-colors duration-200 ${
                  link.match(pathname) ? "bg-teal-dim font-medium text-fg" : "text-muted hover:bg-panel hover:text-fg"
                }`}
                aria-current={link.match(pathname) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 rounded-xl border border-line bg-panel p-2">
              <p className="px-2 py-1 text-xs uppercase tracking-[0.14em] text-muted-2">About</p>
              {aboutMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    pathname.startsWith(item.href) ? "bg-teal-dim text-fg" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {!user ? (
              <div className="mt-6 space-y-3 border-t border-line pt-6">
                <Button
                  href="/login"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Button>
                <Button
                  href="/signup"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setMobileOpen(false)}
                >
                  Create account
                </Button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl border border-line px-3 py-2 text-center text-xs text-muted">
                  Dashboard
                </Link>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-xl border border-line px-3 py-2 text-center text-xs text-muted">
                  Profile
                </Link>
                <Link href="/leaderboard" onClick={() => setMobileOpen(false)} className="rounded-xl bg-teal px-3 py-2 text-center text-xs font-semibold text-graphite">
                  Rankings
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {user && (
        <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-line bg-panel/95 p-1.5 shadow-2xl backdrop-blur md:hidden" aria-label="Mobile primary">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/practice", label: "Practice", icon: BookOpen },
            { href: "/library", label: "Library", icon: LibraryBig },
            { href: "/leaderboard", label: "Ranks", icon: Trophy },
            { href: "/profile", label: "Profile", icon: UserRound },
          ].map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`rounded-xl px-2 py-1.5 text-center text-[10px] transition-colors ${active ? "bg-teal text-graphite" : "text-muted"}`} aria-current={active ? "page" : undefined}>
                <Icon className="mx-auto h-3.5 w-3.5" />
                <span className="mt-1 block">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
