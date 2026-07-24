import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One bento cell. `className` is where the caller passes its grid
 * span (e.g. "lg:col-span-7 lg:row-span-2") — this component only
 * owns the card chrome (border, background, padding, enter/hover
 * motion), not the grid placement, so the parent's <div className="grid
 * grid-cols-12 ..."> stays the single source of truth for layout.
 */
export default function BentoCard({
  title,
  subtitle,
  action,
  className,
  bodyClassName,
  style,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("motion-card rounded-md border border-line bg-panel p-6", className)}
      style={style}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-lg font-semibold text-fg">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs leading-relaxed text-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {!title && subtitle && <p className="text-xs leading-relaxed text-muted">{subtitle}</p>}
      <div className={cn(title || subtitle ? "mt-5" : undefined, bodyClassName)}>{children}</div>
    </div>
  );
}
