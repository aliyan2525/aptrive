"use client";

import { forwardRef, useState } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold " +
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

// Ripple tint per variant — primary sits on a light teal fill with
// dark text, so its ripple needs to be a dark wash; the darker
// variants get a light wash instead. Kept as an rgba string (not a
// CSS var) so opacity stays correct regardless of the button's own
// background/text color tokens.
const rippleColor: Record<ButtonVariant, string> = {
  primary: "rgba(11, 14, 19, 0.22)",
  secondary: "rgba(243, 245, 242, 0.16)",
  ghost: "rgba(243, 245, 242, 0.14)",
  outline: "rgba(243, 245, 242, 0.16)",
};

type Ripple = { id: number; x: number; y: number; size: number };

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  /** Click-positioned ripple, on by default. Set false to opt out per-instance. */
  ripple?: boolean;
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
 * Ripple is click-positioned (measured from the click coordinates,
 * not a centered CSS-only fake) and sized to cover the button from
 * whichever corner is farthest from the click point, matching the
 * classic Material ripple math. It respects prefers-reduced-motion
 * via the global animation-duration override in globals.css, same as
 * every other animation in this codebase.
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    ripple = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const classes = cn(
    base,
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
    loading && "cursor-wait",
    className,
  );

  function spawnRipple(event: ReactMouseEvent<HTMLElement>) {
    if (!ripple || loading) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Size to reach the farthest corner from the click point so the
    // ripple always fully covers the button by the time it fades.
    const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, size }]);
  }

  function removeRipple(id: number) {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }

  const rippleLayer = ripple ? (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.id}
          onAnimationEnd={() => removeRipple(r.id)}
          className="btn-ripple absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            marginLeft: -r.size / 2,
            marginTop: -r.size / 2,
            backgroundColor: rippleColor[variant],
          }}
        />
      ))}
    </span>
  ) : null;

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
    const { href, onClick, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={loading || undefined}
        onClick={(event) => {
          spawnRipple(event);
          onClick?.(event);
        }}
        {...anchorRest}
      >
        {rippleLayer}
        {content}
      </Link>
    );
  }

  const { disabled, onClick, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={(event) => {
        spawnRipple(event);
        onClick?.(event);
      }}
      {...buttonRest}
    >
      {rippleLayer}
      {content}
    </button>
  );
});

export default Button;
