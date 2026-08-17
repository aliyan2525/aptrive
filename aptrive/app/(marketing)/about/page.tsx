import type { Metadata } from "next";
import type React from "react";
import { BarChart3, Eye, Flag, GraduationCap, Rocket, ShieldCheck, Target } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";
import TickDivider from "@/components/TickDivider";

export const metadata: Metadata = {
  title: "About & Contact - Aptrive",
  description:
    "Aptrive's company story, mission, vision, values, support, FAQs, and contact information.",
};

const values = [
  ["Precision", "Every recommendation should make the next study session clearer."],
  ["Ambition", "Built for students who want to rank, not merely qualify."],
  ["Trust", "Clear progress, transparent data, and no false confidence."],
  ["Craft", "A premium software experience for a serious academic journey."],
  ["Access", "World-class preparation should be available to students across Pakistan."],
  ["Momentum", "Small wins, streaks, and feedback loops that keep learners moving."],
];

export default function AboutPage() {
  return (
    <>
      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="eyebrow">About Aptrive</div>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-6xl">
              Pakistan&apos;s intelligent <span className="aurora-text">learning</span> command center.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Aptrive helps ambitious students prepare for competitive university entrance examinations with structured content, analytics, gamified progress, and future-ready AI personalization.
            </p>
          </div>
          <div className="premium-shell rounded-[1.75rem] p-7">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-violet-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Company snapshot</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <MiniStat icon={GraduationCap} label="Focus" value="EdTech" />
              <MiniStat icon={Flag} label="Market" value="Pakistan" />
              <MiniStat icon={ShieldCheck} label="Core exam" value="NUST NET" />
              <MiniStat icon={Rocket} label="Expansion" value="ECAT/MDCAT" />
            </div>
          </div>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <Statement icon={Target} title="Mission" body="Give every serious student a precise, measurable, and motivating path from uncertainty to exam readiness." />
          <Statement icon={Eye} title="Vision" body="Become Pakistan's most trusted AI-powered entrance preparation platform, scaling from NUST NET into every major academic gateway." />
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">Why Aptrive</div>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Traditional prep gives every student the same plan. Aptrive adapts the plan to the student.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {values.map(([name, body]) => (
            <div key={name} className="motion-card premium-shell rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-fg">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <TickDivider />

      <section id="contact" className="container-aptrive py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="eyebrow">Contact & support</div>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Get help, share feedback, or ask about enrollment.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Reach the Aptrive team for product support, admission guidance, content feedback, partnerships, and student success questions.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MiniStat label="Email" value="hello@aptrive.com" />
              <MiniStat label="Response" value="24 hours" />
              <MiniStat label="Support" value="Students" />
              <MiniStat label="Feedback" value="Always open" />
            </div>
          </div>
          <div className="premium-shell rounded-[1.75rem] p-6">
            <ContactForm />
          </div>
        </div>
      </section>

      <TickDivider />

      <section className="container-aptrive py-16 md:py-24">
        <div className="eyebrow">FAQs</div>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Answers before you begin.
        </h2>
        <div className="mt-10">
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}

function Statement({ icon: Icon, title, body }: { icon: typeof Target; title: string; body: string }) {
  return (
    <div className="premium-shell rounded-[1.75rem] p-8">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-teal-dim text-teal">
        <Icon className="h-8 w-8" strokeWidth={1.7} />
      </div>
      <div className="eyebrow">{title}</div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5 shadow-sm">
      {Icon ? (
        <Icon className="mb-5 h-8 w-8 text-teal" strokeWidth={1.6} />
      ) : (
        <div className="mb-5 h-8 w-8" />
      )}
      <p className="text-xs uppercase tracking-wide text-muted-2">{label}</p>
      <p className="mt-2 text-sm font-semibold text-fg">{value}</p>
    </div>
  );
}

