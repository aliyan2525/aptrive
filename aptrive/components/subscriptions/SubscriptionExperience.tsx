"use client";

import Link from "next/link";
import { Check, ChevronDown, LockKeyhole, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const plans = [
  {
    id: "free",
    eyebrow: "Start here",
    name: "Free",
    price: "PKR 0",
    cadence: "forever",
    description: "Build your first signal before you commit to a full plan.",
    benefits: ["5 mock exams", "Core score tools", "Starter library access"],
    cta: "Start free",
    href: "/signup?plan=free&source=subscriptions",
    tone: "quiet",
  },
  {
    id: "monthly",
    eyebrow: "Most flexible",
    name: "Pro Monthly",
    price: "PKR 1,000",
    cadence: "/ month",
    description: "A focused preparation system for the admission cycle you are in.",
    benefits: ["Unlimited mock exams", "Full practice and revision library", "University-specific pathways", "Readiness analytics and weak-topic guidance", "Priority product support"],
    cta: "Choose monthly",
    href: "/signup?plan=pro-monthly&source=subscriptions",
    tone: "featured",
  },
  {
    id: "annual",
    eyebrow: "Best value",
    name: "Pro Annual",
    price: "PKR 10,000",
    cadence: "/ year",
    description: "The complete year of preparation, with two months included.",
    benefits: ["Everything in Pro Monthly", "Save PKR 2,000 every year", "One plan for the full admission season", "Priority access to new prep tools", "A calmer, longer runway to your target"],
    cta: "Choose annual",
    href: "/signup?plan=pro-annual&source=subscriptions",
    tone: "annual",
  },
] as const;

export default function SubscriptionExperience() {
  const reducedMotion = useReducedMotion();
  const motionEnabled = reducedMotion === false;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9ff] text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_8%,rgba(102,220,205,0.24),transparent_26rem),radial-gradient(circle_at_12%_20%,rgba(126,108,255,0.17),transparent_28rem),linear-gradient(180deg,#ffffff_0%,#f7f9ff_48%,#eef3ff_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-violet-300/20 bg-white/20 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-[92rem] px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={motionEnabled ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/75 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm backdrop-blur-xl"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Aptrive plans</span>
            <h1 className="font-display mt-7 text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-fg sm:text-6xl lg:text-7xl">Choose the amount of<br /><span className="bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">focus you need.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">Start free. Move to Pro when you want the complete signal: unlimited practice, sharper feedback, and a plan built around your target university.</p>
          </motion.div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {plans.map((plan, index) => (
            <motion.article key={plan.id} initial={motionEnabled ? { opacity: 0, y: 22 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: motionEnabled ? index * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }} className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(44,57,110,0.08)] backdrop-blur-2xl sm:p-7 ${plan.tone === "featured" ? "border-violet-400/60 bg-[linear-gradient(150deg,rgba(255,255,255,0.96),rgba(242,239,255,0.93)_54%,rgba(230,249,246,0.88))] shadow-[0_24px_80px_rgba(94,72,220,0.16)] lg:-translate-y-3" : plan.tone === "annual" ? "border-teal-300/60 bg-[linear-gradient(150deg,rgba(255,255,255,0.96),rgba(237,252,249,0.94)_58%,rgba(238,244,255,0.92))]" : "border-white/90 bg-white/78"}`}>
              {plan.tone === "featured" && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500" />}
              {plan.tone === "annual" && <div className="absolute right-5 top-5 rounded-full border border-teal-400/30 bg-teal-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-teal-700">Save PKR 2,000</div>}
              <div className="flex items-start justify-between gap-4"><div><p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${plan.tone === "featured" ? "text-violet-700" : "text-muted-2"}`}>{plan.eyebrow}</p><h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-fg">{plan.name}</h2></div>{plan.tone === "featured" && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20"><Sparkles className="h-4 w-4" aria-hidden="true" /></span>}</div>
              <div className="mt-8 flex items-end gap-2"><span className="font-display text-4xl font-semibold tracking-[-0.05em] text-fg">{plan.price}</span><span className="pb-1 text-sm text-muted">{plan.cadence}</span></div>
              <p className="mt-4 min-h-12 text-sm leading-6 text-muted">{plan.description}</p>
              <Link href={plan.href} data-cta={`subscription-${plan.id}`} className={`pressable mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition hover:-translate-y-0.5 ${plan.tone === "quiet" ? "border border-line bg-white/85 text-fg hover:border-violet-300" : plan.tone === "annual" ? "bg-teal-600 text-white shadow-[0_12px_28px_rgba(18,165,148,0.22)] hover:bg-teal-700" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]"}`}>{plan.cta} <ArrowUpRight className="h-4 w-4" /></Link>
              <div className="mt-8 border-t border-line/80 pt-6"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-2">Includes</p><ul className="mt-4 space-y-3">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2.5 text-sm leading-5 text-fg"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.tone === "quiet" ? "text-muted" : "text-teal-600"}`} aria-hidden="true" />{benefit}</li>)}</ul></div>
            </motion.article>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 rounded-[1.5rem] border border-white/90 bg-white/68 p-5 shadow-[0_14px_44px_rgba(44,57,110,0.06)] backdrop-blur-xl sm:grid-cols-3 sm:p-6"><TrustItem icon={ShieldCheck} title="No confusing tiers" body="One clear Pro system, billed monthly or annually." /><TrustItem icon={LockKeyhole} title="Secure by design" body="Your account and progress remain yours." /><TrustItem icon={ChevronDown} title="Change when you need" body="Start free, then upgrade when the timing is right." /></div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-muted-2">Plans are presented in PKR. Upgrade buttons currently take you through the existing Aptrive account flow; payment activation can be connected to your billing provider without redesigning this page.</p>
      </section>
    </main>
  );
}

function TrustItem({ icon: Icon, title, body }: { icon: typeof ShieldCheck; title: string; body: string }) {
  return <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-700"><Icon className="h-4 w-4" aria-hidden="true" /></span><div><p className="text-sm font-semibold text-fg">{title}</p><p className="mt-1 text-xs leading-5 text-muted">{body}</p></div></div>;
}
