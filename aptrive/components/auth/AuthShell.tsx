import type { ReactNode } from "react";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-graphite px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="font-display mt-2 text-3xl font-semibold text-fg">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>

        <div className="rounded-md border border-line bg-panel p-6 sm:p-8">
          {children}
        </div>

        {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
      </div>
    </main>
  );
}
