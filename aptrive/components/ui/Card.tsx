import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "interactive" | "gradient" | "sunken";

const variantClass: Record<CardVariant, string> = {
  // Static content grouping — no hover behavior.
  default: "border border-line bg-panel",
  // Adds the existing lift/glow-border hover treatment (.motion-card
  // already defines the enter + hover animation in globals.css).
  interactive: "motion-card border border-line bg-panel",
  // For a card that should stand out as a highlighted/featured item
  // (e.g. a recommended plan, an AI-recommendation card).
  gradient:
    "border border-teal/30 bg-gradient-to-b from-teal-dim to-panel shadow-[0_18px_55px_rgba(0,0,0,0.24)]",
  // Recessed panel, for content nested inside another card (e.g. a
  // stat block inside a dashboard bento cell).
  sunken: "border border-line bg-surface-sunken",
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
