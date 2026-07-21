"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserMenu, { type HeaderUser } from "@/components/UserMenu";

const navLinks = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/dashboard",
    label: "Dashboard",
    authOnly: true,
    match: (path: string) => path.startsWith("/dashboard"),
  },
  {
    href: "/practice",
    label: "Practice",
    authOnly: true,
    match: (path: string) => path.startsWith("/practice"),
  },
  {
    href: "/library",
    label: "Library",
    match: (path: string) => path.startsWith("/library"),
  },
  {
    href: "/leaderboard",
    label: "Rankings",
    match: (path: string) => path.startsWith("/leaderboard"),
  },
  {
    href: "/courses",
    label: "Courses",
    match: (path: string) => path.startsWith("/courses"),
  },
  {
    href: "/calculator",
    label: "Calculator",
    match: (path: string) => path.startsWith("/calculator"),
  },
  {
    href: "/about",
    label: "About & Contact",
    match: (path: string) => path === "/about",
  },
];

function navLinkClass(active: boolean) {
  return active
    ? "relative text-sm font-medium text-fg after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-teal after:content-['']"
    : "relative text-sm text-muted transition-colors hover:text-fg after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-teal after:transition-all after:duration-300 after:[transition-timing-function:var(--ease-smooth)] after:content-[''] hover:after:w-full";
}

export default function SiteNav({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const visibleLinks = useMemo(
    () => navLinks.filter((link) => !link.authOnly || user),
    [user]
  );

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
        setHidden(true); // scrolling down — get out of the way
      } else if (y < lastY.current - 4) {
        setHidden(false); // scrolling up — bring it back
      }
      lastY.current = y;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [mobileOpen]);

  return (
    <>
      {/*
        The translateY hide/show lives on this top <header> only — never
        wrap the fixed-position mobile menu / bottom nav below in an
        element that has a `transform`, since a transformed ancestor
        creates a new containing block and would trap `fixed` children
        inside the header's box instead of the viewport.
      */}
      <header
        className={`sticky top-0 z-50 border-b border-line bg-graphite/90 backdrop-blur transition-transform duration-300 [transition-timing-function:var(--ease-smooth)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`container-aptrive flex h-16 items-center justify-between transition-colors duration-300 ${
            scrolled ? "bg-graphite/80 backdrop-blur" : ""
          }`}
        >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Aptrive — home">
          <Image
            src="/logo-mark.png"
            alt=""
            width={34}
            height={38}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-fg">
            Aptrive
          </span>
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
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="pressable hidden h-9 min-w-[160px] items-center gap-2 rounded-sm border border-line bg-panel/70 px-3 text-sm text-muted hover:border-teal/40 hover:text-fg lg:flex"
            aria-label="Search library"
          >
            <span aria-hidden="true">⌕</span>
            <span>Search</span>
            <span className="ml-auto font-mono-data text-[10px] text-muted-2">/</span>
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="pressable hidden h-9 w-9 place-items-center rounded-sm border border-line bg-panel text-muted hover:border-teal/40 hover:text-fg sm:grid"
                aria-label="Notifications"
              >
                <span aria-hidden="true">◦</span>
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted transition-colors hover:text-fg sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="pressable glow-on-hover hidden rounded-sm border border-teal/40 bg-teal-dim px-4 py-2 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-graphite sm:block"
              >
                Create account
              </Link>
            </>
          )}

          <button
            type="button"
            className="pressable flex h-10 w-10 items-center justify-center rounded-sm border border-line text-fg md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() =>
              setMobileOpen((open) => {
                const next = !open;
                // Never hide the bar while the mobile menu is open, or
                // the menu and its trigger would visually disconnect.
                if (next) setHidden(false);
                return next;
              })
            }
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-16 z-40 bg-graphite/95 backdrop-blur md:hidden"
        >
          <nav
            className="container-aptrive flex animate-[enter-up_0.28s_ease_both] flex-col gap-1 py-6"
            aria-label="Mobile"
          >
            <Link
              href="/library"
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex items-center gap-2 rounded-sm border border-line bg-panel px-4 py-3 text-sm text-muted"
            >
              <span aria-hidden="true">⌕</span>
              Search lessons, tests, topics
            </Link>
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-sm px-3 py-3 text-base transition-colors duration-200 ${
                  link.match(pathname)
                    ? "bg-teal-dim font-medium text-fg"
                    : "text-muted hover:bg-panel hover:text-fg"
                }`}
                aria-current={link.match(pathname) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <div className="mt-6 space-y-3 border-t border-line pt-6">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="pressable block rounded-sm border border-line px-4 py-3 text-center text-sm font-medium text-fg"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="pressable block rounded-sm bg-teal px-4 py-3 text-center text-sm font-medium text-graphite"
                >
                  Create account
                </Link>
              </div>
            )}
            {user && (
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-6">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="pressable rounded-sm border border-line px-4 py-3 text-center text-sm font-medium text-fg"
                >
                  Profile
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMobileOpen(false)}
                  className="pressable rounded-sm bg-teal px-4 py-3 text-center text-sm font-medium text-graphite"
                >
                  Rankings
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {user && (
        <nav
          className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-md border border-line bg-panel/95 p-1 shadow-2xl backdrop-blur md:hidden"
          aria-label="Mobile primary"
        >
          {[
            { href: "/dashboard", label: "Home" },
            { href: "/practice", label: "Practice" },
            { href: "/leaderboard", label: "Ranks" },
            { href: "/profile", label: "Profile" },
          ].map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`pressable rounded-sm px-2 py-2 text-center text-xs font-medium transition-colors duration-200 ${
                  active ? "bg-teal text-graphite" : "text-muted"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
