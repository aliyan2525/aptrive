import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "interactive" | "gradient" | "sunken";

const variantClass: Record<CardVariant, string> = {
  // Static content grouping — no hover behavior.
  default: "border border-line bg-[var(--surface-elevated)] shadow-sm relative overflow-hidden before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-white/5",
  // Adds the existing lift/glow-border hover treatment.
  interactive: "motion-card border border-line bg-[var(--surface-elevated)] relative overflow-hidden before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-white/5",
  // Premium glass treatment for featured content.
  gradient:
    "glass-panel relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none border-t-white/10 shadow-lg",
  // Recessed panel, for content nested inside another card.
  sunken: "border border-black/20 bg-[var(--surface-sunken)] shadow-inner",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: "sm" | "md" | "lg" | "none";
  children?: ReactNode;
};

const paddingClass: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({ variant = "default", padding = "md", className, children, ...rest }: CardProps) {
  return (
    <div className={cn("rounded-2xl", variantClass[variant], paddingClass[padding], className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-heading-3 text-fg", className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body-sm", className)} {...rest}>
      {children}
    </p>
  );
}
