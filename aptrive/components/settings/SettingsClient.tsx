"use client";

import { useState, useTransition } from "react";
import type { Database } from "@/lib/database.types";
import { saveSettingsAction } from "@/app/(app)/settings/actions";
import type { OnboardingInput } from "@/lib/repositories/onboarding.repository";

type StudentProfile = Database["public"]["Tables"]["student_profiles"]["Row"];
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  Cloud,
  CreditCard,
  Edit3,
  HelpCircle,
  KeyRound,
  Lock,
  Moon,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  UserRound,
  WalletCards,
  Loader2
} from "lucide-react";

const settingsNav = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "study", label: "Study Preferences", icon: SlidersHorizontal },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function SettingsClient({
  user,
  profile,
}: {
  user: { email: string; displayName: string };
  profile: StudentProfile | null;
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, startSaving] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [targetUniversity, setTargetUniversity] = useState(profile?.target_university ?? "NUST");
  const [dailyTarget, setDailyTarget] = useState(String(profile?.daily_study_target_minutes ?? 90));

  function handleSave() {
    setSaveSuccess(false);
    setSaveError(null);
    startSaving(async () => {
      try {
        const input: OnboardingInput = {
          displayName: profile?.display_name ?? user.displayName,
          targetUniversity,
          targetProgram: profile?.target_degree ?? "Computer Science",
          entryTest: (profile?.entry_test ?? "NET") as OnboardingInput["entryTest"],
          educationLevel: (profile?.education_level ?? "intermediate") as OnboardingInput["educationLevel"],
          matricMarks: profile?.matric_marks ?? null,
          intermediateMarks: profile?.intermediate_marks ?? null,
          expectedTestDate: profile?.expected_test_date ?? null,
          preferredStudySchedule: (profile?.preferred_schedule ?? "flexible") as OnboardingInput["preferredStudySchedule"],
          dailyStudyTargetMinutes: Number(dailyTarget) || 90,
          improvementSubjects: profile?.weak_subjects ?? [],
        };
        await saveSettingsAction(input);
        setSaveSuccess(true);
        window.setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Settings could not be saved. Please try again.");
      }
    });
  }

  return (
    <div className="settings-aurora mx-auto grid max-w-[96rem] gap-6 xl:grid-cols-[16rem_minmax(0,1fr)] relative">
      
      {/* Toast Notification */}
      {saveSuccess && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(46,39,97,.2)] animate-in slide-in-from-bottom-5">
          <Check className="h-5 w-5" />
          Settings saved successfully.
        </div>
      )}

      <aside className="premium-shell rounded-[1.5rem] border border-white/80 bg-white/80 p-4 shadow-[0_20px_60px_rgba(46,39,97,.08)] backdrop-blur-2xl xl:sticky xl:top-24 xl:h-fit">
        <h1 className="px-2 pb-4 font-display text-2xl font-bold text-[var(--fg)]">Settings</h1>
        <nav className="space-y-1" aria-label="Settings sections">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-pressed={isActive}
                className={`flex h-11 w-full items-center gap-3 rounded-[0.8rem] px-3 text-left text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-violet-500/10 text-violet-700 shadow-sm" 
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-5">
        {activeTab === "profile" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ProfileCard user={user} profile={profile} />
          </div>
        )}

        {activeTab === "study" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Panel title="Study Preferences" subtitle="Configure your academic parameters and objectives.">
              <div className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)]/50">
                  <div>
                    <p className="font-bold text-[var(--fg)]">Target University</p>
                    <p className="text-sm text-gray-500">Your primary university admission target.</p>
                  </div>
                  <select 
                    value={targetUniversity}
                    onChange={(e) => setTargetUniversity(e.target.value)}
                    className="h-11 rounded-xl border border-neutral-200 bg-white/80 px-3 text-sm font-semibold outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                  >
                    <option value="NUST">NUST</option>
                    <option value="FAST">FAST-NUCES</option>
                    <option value="COMSATS">COMSATS</option>
                    <option value="GIKI">GIKI</option>
                    <option value="PIEAS">PIEAS</option>
                    <option value="UET">UET Lahore</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)]/50">
                  <div>
                    <p className="font-bold text-[var(--fg)]">Daily Training Goal</p>
                    <p className="text-sm text-gray-500">Your daily time commitment for active practice.</p>
                  </div>
                  <select value={dailyTarget} onChange={(e) => setDailyTarget(e.target.value)} className="h-11 rounded-xl border border-neutral-200 bg-white/80 px-3 text-sm font-semibold outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10">
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    className="pressable flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(111,69,255,.2)] transition hover:-translate-y-0.5 hover:bg-violet-800 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin"                 aria-label="Saving settings" /> : "Save Changes"}
                  </button>
                </div>
                {saveError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>}
              </div>
            </Panel>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Panel title="Appearance" subtitle="Customize your interface presentation.">
              <div className="grid gap-4 sm:grid-cols-3 mt-4">
                <AppearanceOption title="Light" icon={Sun} selected />
                <AppearanceOption title="Dark" icon={Moon} />
                <AppearanceOption title="System" icon={Cloud} meta="Auto" />
              </div>
              <p className="mt-6 text-sm font-semibold text-gray-500">Accent Color</p>
              <div className="mt-3 flex gap-5 pb-4">
                {["#5b36ff", "#1685f8", "#10b981", "#f97316", "#f43f72"].map((color, index) => (
                  <button 
                    key={color} 
                    className="grid h-8 w-8 place-items-center rounded-full transition-transform hover:scale-110 ring-2 ring-offset-2 ring-offset-[var(--bg)]"
                    style={{ backgroundColor: color, "--tw-ring-color": index === 0 ? color : 'transparent' } as React.CSSProperties}
                  >
                    {index === 0 && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        )}
        
        {activeTab === "security" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Panel title="Security & account" subtitle="Keep access to your Aptrive account under your control.">
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link href="/forgot-password" className="rounded-xl border border-[var(--line)] bg-white/70 p-4 text-sm font-semibold text-fg transition hover:border-violet-300 hover:bg-violet-50">
                  Reset password
                  <span className="mt-1 block text-xs font-normal text-muted">Send a secure password-reset email.</span>
                </Link>
                <Link href="/privacy" className="rounded-xl border border-[var(--line)] bg-white/70 p-4 text-sm font-semibold text-fg transition hover:border-violet-300 hover:bg-violet-50">
                  Privacy policy
                  <span className="mt-1 block text-xs font-normal text-muted">Review how Aptrive handles account data.</span>
                </Link>
              </div>
            </Panel>
          </div>
        )}

      </section>
    </div>
  );
}

function ProfileCard({ user, profile }: { user: { email: string; displayName: string }; profile: StudentProfile | null }) {
  return (
    <section className="premium-shell settings-panel rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(46,39,97,.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--fg)]">Identity & Access</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your identity and contact details.</p>
        </div>
        <Link href="/profile" className="inline-flex h-11 items-center gap-2 rounded-[0.75rem] border border-[var(--line)] px-4 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-[#f8faff] dark:hover:bg-white/5 transition-colors">
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit Profile
        </Link>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[6rem_repeat(4,minmax(0,1fr))] md:items-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-2xl font-bold text-white shadow-lg">{(profile?.display_name ?? user.displayName).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
        <Info label="Full Name" value={profile?.display_name ?? user.displayName} />
        <Info label="Email" value={user.email || "Not available"} />
        <Info label="Target University" value={profile?.target_university ?? "Not set"} />
        <Info label="Entry Test" value={profile?.entry_test ?? "Not set"} />
      </div>
    </section>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="premium-shell settings-panel rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(46,39,97,.08)] backdrop-blur-xl">
      <div className="mb-2 flex items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--fg)]">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        {action && <button className="text-sm font-bold text-blue-600">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-2 font-bold text-[var(--fg)]">{value}</p>
    </div>
  );
}

function AppearanceOption({ title, icon: Icon, selected, meta }: { title: string; icon: typeof Sun; selected?: boolean; meta?: string }) {
  return (
    <button className={`relative grid min-h-24 place-items-center rounded-[1rem] border p-4 text-center transition ${selected ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-[var(--line)] hover:bg-[#f8faff] dark:hover:bg-white/5"}`}>
      {selected && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-blue-600"><Check className="h-3 w-3 text-white" /></span>}
      <Icon className={`h-6 w-6 ${selected ? "text-blue-600" : "text-gray-400"}`} />
      <span className="text-sm font-bold mt-2 text-[var(--fg)]">{title}</span>
      {meta && <span className="text-xs text-gray-500">{meta}</span>}
    </button>
  );
}
