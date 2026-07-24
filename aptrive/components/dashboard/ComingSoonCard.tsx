import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import BentoCard from "./BentoCard";

export default function ComingSoonCard({
  title,
  subtitle,
  icon: Icon,
  message,
  cta,
  className,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  message: string;
  cta?: { href: string; label: string };
  className?: string;
}) {
  return (
    <BentoCard title={title} subtitle={subtitle} className={className}>
      <div className="flex flex-col items-start gap-3 rounded-sm border border-dashed border-line-strong bg-panel-2 p-5">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-panel text-muted">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-muted">{message}</p>
        {cta && (
          <Link href={cta.href} className="text-sm font-semibold text-teal hover:underline">
            {cta.label} &gt;
          </Link>
        )}
      </div>
    </BentoCard>
  );
}
