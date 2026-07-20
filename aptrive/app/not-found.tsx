import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-aptrive flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="eyebrow">404</div>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The page you are looking for does not exist or may have been moved.
        Return to the homepage or explore the library to continue preparing.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm bg-teal px-6 py-3 text-sm font-medium text-graphite hover:opacity-90"
        >
          Go to homepage
        </Link>
        <Link
          href="/library"
          className="rounded-sm border border-line-strong px-6 py-3 text-sm font-medium text-fg hover:border-teal/50"
        >
          Browse library
        </Link>
      </div>
    </section>
  );
}
