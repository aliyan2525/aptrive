"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Check, CreditCard, LockKeyhole, X } from "lucide-react";

type PlanId = "free" | "pro-monthly" | "pro-annual";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  description: string;
  highlights: string[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "PKR 0",
    cadence: "forever",
    description: "A simple starting point for building your first preparation signal.",
    highlights: ["5 mock exams", "Core score tools", "Starter Library access"],
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: "PKR 1,000",
    cadence: "/ month",
    description: "Full practice depth with the flexibility to change when your admission cycle changes.",
    highlights: ["Unlimited mocks", "Full practice and revision library", "Readiness analytics", "Priority support"],
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    price: "PKR 10,000",
    cadence: "/ year",
    description: "The complete Pro system for the full admission season, with PKR 2,000 saved.",
    highlights: ["Everything in Pro Monthly", "Two months included", "Priority access to new prep tools", "One calm yearly renewal"],
  },
];

export default function SubscriptionManagerModal({
  open,
  onClose,
  currentPlan = "free",
}: {
  open: boolean;
  onClose: () => void;
  currentPlan?: PlanId;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(currentPlan);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>("[aria-labelledby='subscription-modal-title']");
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  const selected = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];
  const isCurrent = selected.id === currentPlan;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="subscription-modal-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] border border-white/90 bg-[#f8faff]/95 p-5 shadow-[0_28px_100px_rgba(25,35,85,0.25)] backdrop-blur-2xl sm:max-w-3xl sm:rounded-[2rem] sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">Account / Subscription</p>
            <h2 id="subscription-modal-title" className="font-display mt-2 text-2xl font-semibold tracking-tight text-fg">Manage your plan</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Review your current access, choose a plan, and continue through the secure account flow.</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close subscription manager" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-muted transition hover:border-violet-300 hover:text-fg"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>

        <div className="mt-5 rounded-2xl border border-teal-300/30 bg-teal-50/65 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-teal-700 shadow-sm"><BadgeCheck className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-800">Current plan</p><p className="mt-1 font-display text-lg font-semibold text-fg">{plans.find((plan) => plan.id === currentPlan)?.name ?? "Free"}</p><p className="mt-1 text-xs leading-5 text-muted">Active account · Billing provider not connected yet</p></div></div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted sm:mt-0"><LockKeyhole className="h-4 w-4 text-teal-700" aria-hidden="true" /> No payment is taken in this step.</div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {plans.map((plan) => {
            const active = selectedPlan === plan.id;
            const current = currentPlan === plan.id;
            return <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)} aria-pressed={active} className={`relative rounded-2xl border p-4 text-left transition ${active ? "border-violet-500 bg-violet-50/80 shadow-[0_12px_32px_rgba(111,69,255,0.12)]" : "border-line bg-white/75 hover:border-violet-300"}`}>
              {current && <span className="absolute right-3 top-3 rounded-full bg-teal-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-teal-700">Current</span>}
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-2">{plan.name}</p>
              <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">{plan.price}</p>
              <p className="text-xs text-muted">{plan.cadence}</p>
              <p className="mt-3 text-xs leading-5 text-muted">{plan.description}</p>
              <ul className="mt-4 space-y-2">{plan.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2 text-xs leading-5 text-fg"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden="true" />{highlight}</li>)}</ul>
            </button>;
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white/65 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-700"><CreditCard className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold text-fg">Renewal and billing</p><p className="mt-1 text-xs leading-5 text-muted">Renewal controls become available once a billing method is connected. You can review the plan and continue to checkout below.</p></div></div><span className="mt-3 inline-flex shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-700 sm:mt-0">Not active</span></div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onClose} className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-semibold text-muted hover:border-violet-300 hover:text-fg">Close</button>{isCurrent ? <Link href="/subscriptions?source=settings-manage" onClick={onClose} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(111,69,255,0.2)] hover:bg-violet-800">View plan details</Link> : <Link href={`/subscriptions?plan=${selected.id}&source=settings-manage`} onClick={onClose} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:opacity-95">Continue with {selected.name}</Link>}</div>
      </section>
    </div>
  );
}
