import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface AppLogoProps {
  className?: string;
  compact?: boolean;
}

export default function AppLogo({ className, compact = false }: AppLogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("group flex items-center gap-3 pressable", compact ? "justify-center px-0" : "px-2", className)}
      aria-label="Aptrive dashboard"
    >
      <Image
        src="/logo-mark.png"
        alt="Aptrive Logo"
        width={50}
        height={56}
        className={cn(
          "w-auto object-contain transition-transform duration-300 group-hover:scale-105",
          compact ? "h-9" : "h-10"
        )}
        priority
      />
      <span
        className={cn(
          "font-display text-2xl font-bold tracking-tight text-[#08112f] dark:text-white",
          compact && "sr-only"
        )}
      >
        Aptrive
      </span>
    </Link>
  );
}
