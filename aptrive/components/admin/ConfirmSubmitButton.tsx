"use client";

/**
 * ADDED 2026-07-29, fixing the "no confirmation on any destructive
 * action in the catalog manager" bug — every delete button in
 * app/admin/catalog/page.tsx was a bare `<button type="submit">`
 * inside a Server Action form, with nothing stopping an accidental
 * click. This wraps that same submit button with a native
 * `confirm()` gate: if the admin cancels, `e.preventDefault()` stops
 * the form (and the Server Action) from firing at all. The
 * surrounding `<form action={...}>` and Server Action wiring in the
 * page component are untouched — this only replaces the plain
 * `<button>` element.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  className,
  children,
}: {
  confirmMessage: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
