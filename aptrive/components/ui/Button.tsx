import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold " +
  "transition duration-200 [transition-timing-function:var(--ease-smooth)] " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-teal text-graphite hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(35,213,196,0.28)] active:translate-y-0",
  secondary:
    "bg-panel-2 text-fg border border-line-strong hover:border-teal/50 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-muted hover:text-fg hover:bg-panel-2",
  outline: "border border-line-strong bg-panel/70 text-fg hover:border-teal/50 hover:-translate-y-0.5 active:translate-y-0",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-sm",
  icon: "h-10 w-10 shrink-0 p-0",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Shared button primitive. Renders a Next.js <Link> when `href` is
 * passed, otherwise a native <button>, so callers don't have to pick
 * between the two markup shapes themselves.
 *
 * No ripple effect: the reference bar for this redesign (Stripe,
 * Vercel, Linear) uses restrained lift/glow hover states rather than
 * a Material-style ripple, so lift + shadow-glow was used instead to
 * stay consistent with the rest of the motion system (see
 * .motion-card / .pressable in globals.css).
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, leftIcon, rightIcon, fullWidth, className, children, ...rest },
  ref,
) {
  const classes = cn(
    base,
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
    loading && "cursor-wait",
    className,
  );

  const content =
    size === "icon" ? (
      loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : children
    ) : (
      <>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
        {children ? <span className={loading ? "opacity-70" : undefined}>{children}</span> : null}
        {!loading ? rightIcon : null}
      </>
    );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={loading || undefined}
        {...anchorRest}
      >
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

export default Button;
