"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  Cloud,
  CreditCard,
  Database,
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
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy & Security", icon: Lock },
  { id: "subscription", label: "Subscription", icon: WalletCards },
];

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Example State for Study Preferences
  const [targetExam, setTargetExam] = useState("FAST-NUCES");
  
  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="mx-auto grid max-w-[96rem] gap-6 xl:grid-cols-[16rem_minmax(0,1fr)] relative">
      
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl animate-in slide-in-from-bottom-5">
          <Check className="h-5 w-5" />
          Settings saved successfully.
        </div>
      )}

      <aside className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel)]/86 p-4 shadow-[0_24px_70px_rgba(36,52,104,0.07)] dark:shadow-none backdrop-blur-2xl xl:sticky xl:top-24 xl:h-fit">
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
                className={`flex h-11 w-full items-center gap-3 rounded-[0.8rem] px-3 text-left text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-[#f0f1ff] dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" 
                    : "text-[#263457] dark:text-gray-300 hover:bg-[#f8faff] dark:hover:bg-white/5"
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
            <ProfileCard />
          </div>
        )}

        {activeTab === "study" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Panel title="Study Preferences" subtitle="Customize your learning experience.">
              <div className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)]/50">
                  <div>
                    <p className="font-bold text-[var(--fg)]">Target Exam</p>
                    <p className="text-sm text-gray-500">The primary university test you are preparing for.</p>
                  </div>
                  <select 
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="h-10 rounded-lg border border-[var(--line)] bg-transparent px-3 text-sm font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="FAST-NUCES">FAST-NUCES</option>
                    <option value="NUST-NET">NUST NET</option>
                    <option value="GIKI">GIKI</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)]/50">
                  <div>
                    <p className="font-bold text-[var(--fg)]">Daily Study Goal</p>
                    <p className="text-sm text-gray-500">Your target practice time per day.</p>
                  </div>
                  <select className="h-10 rounded-lg border border-[var(--line)] bg-transparent px-3 text-sm font-semibold outline-none focus:border-blue-500">
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>120 minutes</option>
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Panel title="Appearance" subtitle="Choose how Aptrive looks for you.">
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
        
        {/* Fill in other tabs minimally */}
        {["notifications", "privacy", "subscription"].includes(activeTab) && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 grid place-items-center h-64 rounded-2xl border border-dashed border-[var(--line)]">
             <div className="text-center text-gray-500">
               <p className="font-bold">Work in Progress</p>
               <p className="text-sm">This section is being wired up to the backend.</p>
             </div>
          </div>
        )}

      </section>
    </div>
  );
}

function ProfileCard() {
  return (
    <section className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--fg)]">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your personal information and profile.</p>
        </div>
        <Link href="/profile" className="inline-flex h-11 items-center gap-2 rounded-[0.75rem] border border-[var(--line)] px-4 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-[#f8faff] dark:hover:bg-white/5 transition-colors">
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit Profile
        </Link>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[6rem_repeat(4,minmax(0,1fr))] md:items-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-2xl font-bold text-white shadow-lg">DF</span>
        <Info label="Full Name" value="Daniyal Farooq" />
        <Info label="Email" value="daniyal.farooq@gmail.com" />
        <Info label="Username" value="df_aspirant" />
        <Info label="Phone" value="+92 301 1234567" />
      </div>
    </section>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)] dark:shadow-none">
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
