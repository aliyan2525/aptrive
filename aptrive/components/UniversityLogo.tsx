import Image from "next/image";
import { resolveUniversityLogo, universityInitials } from "@/lib/university-logos";

type UniversityLogoProps = {
  /** Any of: canonical id ("nust"), course slug ("nust-net"), or display name ("NUST"). */
  university: string;
  /** Fallback initials source if it differs from `university` (e.g. pass the full display name when `university` is an id). */
  displayName?: string;
  /** Pixel size of the square logo slot. Defaults to 40. */
  size?: number;
  className?: string;
};

const SIZE_TO_PADDING: Record<number, string> = {
  28: "p-1",
  32: "p-1",
  36: "p-1.5",
  40: "p-1.5",
  48: "p-2",
  56: "p-2",
  64: "p-2.5",
};

/**
 * Renders a university's logo in a consistent, premium-looking square
 * badge: white card, subtle border, contained SVG. Falls back to a
 * two-letter initials badge (no broken-image icon, no layout shift) for
 * the universities we don't have an uploaded logo for yet.
 */
export default function UniversityLogo({
  university,
  displayName,
  size = 40,
  className = "",
}: UniversityLogoProps) {
  const logo = resolveUniversityLogo(university);
  const padding = SIZE_TO_PADDING[size] ?? "p-1.5";
  const imageSize = Math.round(size * 0.72);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] ${padding} ${className}`}
      style={{ width: size, height: size }}
    >
      {logo.available ? (
        <Image
          src={logo.src}
          alt={`${displayName ?? university} logo`}
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className="font-display font-semibold text-fg"
          style={{ fontSize: Math.max(10, Math.round(size * 0.32)) }}
          aria-label={`${displayName ?? university} logo`}
        >
          {universityInitials(displayName ?? university)}
        </span>
      )}
    </div>
  );
}
