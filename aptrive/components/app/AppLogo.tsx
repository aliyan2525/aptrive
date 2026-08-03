import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-3 px-2 group pressable", className)}
      aria-label="Aptrive dashboard"
    >
      <Image
        src="/logo-mark.png"
        alt="Aptrive Logo"
        width={50}
        height={56}
        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
        priority
      />
      <span className="font-display text-2xl font-bold text-[#08112f] dark:text-white tracking-tight">
        Aptrive
      </span>
    </Link>
  );
}
