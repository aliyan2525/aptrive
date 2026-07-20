import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="container-aptrive grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={34}
              height={38}
              className="h-9 w-auto"
            />
            <span className="font-display text-lg font-semibold tracking-tight text-fg">
              Aptrive
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Intelligent preparation for Pakistan&apos;s most competitive
            university entrance examinations.
          </p>
        </div>

        <div>
          <div className="eyebrow">Platform</div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/library" className="hover:text-fg">Library</Link></li>
            <li><Link href="/courses" className="hover:text-fg">Courses</Link></li>
            <li><Link href="/courses/nust-net" className="hover:text-fg">NUST NET Prep</Link></li>
            <li><Link href="/calculator" className="hover:text-fg">Aggregate Calculator</Link></li>
            <li><Link href="/about" className="hover:text-fg">About Aptrive</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow">Company</div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/about" className="hover:text-fg">Our story</Link></li>
            <li><Link href="/contact" className="hover:text-fg">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-fg">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-fg">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow">Get started</div>
          <p className="mt-4 text-sm text-muted">
            Take a free diagnostic and see exactly where you stand.
          </p>
          <Link
            href="/signup"
            className="mt-3 inline-block rounded-sm border border-teal/40 bg-teal-dim px-4 py-2 text-sm font-medium text-teal hover:bg-teal hover:text-graphite"
          >
            Start free diagnostic
          </Link>
        </div>
      </div>

      <div className="tick-rule" />

      <div className="container-aptrive flex flex-col gap-2 py-6 text-xs text-muted-2 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Aptrive. All rights reserved.</span>
        <span className="font-mono-data">
          Built in Pakistan, for future engineers, doctors &amp; scientists.
        </span>
      </div>
    </footer>
  );
}
