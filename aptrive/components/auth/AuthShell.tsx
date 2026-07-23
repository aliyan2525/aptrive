import type { ReactNode } from "react";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-md",
  panelClassName,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Tailwind max-width class for the shell's content column. Defaults
   *  to max-w-md; the segmented login layout needs more room, so it
   *  passes max-w-lg without affecting signup/forgot/reset pages. */
  maxWidth?: string;
  /** Extra classes for the inner panel (e.g. to drop padding when a
   *  child component like the mode toggle needs to manage its own). */
  panelClassName?: string;
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-graphite px-6 py-16">
      <div className={`w-full ${maxWidth}`}>
        <div className="mb-8 text-center">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="font-display mt-2 text-3xl font-semibold text-fg">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>

        <div
          className={
            panelClassName ??
            "rounded-md border border-line bg-panel p-6 sm:p-8"
          }
        >
          {children}
        </div>

        {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
      </div>
    </main>
  );
}
