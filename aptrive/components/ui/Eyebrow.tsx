import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span className={cn("eyebrow", className)}>
      {children}
    </span>
  );
}
