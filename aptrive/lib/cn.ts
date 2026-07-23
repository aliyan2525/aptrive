/**
 * Minimal classnames joiner. Deliberately not clsx/tailwind-merge —
 * this project has no runtime class-conflict problems that need
 * tailwind-merge's specificity resolution, so a plain filter+join
 * avoids an extra dependency for something this small.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
