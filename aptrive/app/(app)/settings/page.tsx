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
} from "lucide-react";

const settingsNav = [
  { label: "Profile", icon: UserRound, active: true },
  { label: "Account", icon: UserRound },
  { label: "Study Preferences", icon: SlidersHorizontal },
  { label: "Notifications", icon: Bell },
  { label: "Appearance", icon: Palette },
  { label: "Privacy & Security", icon: Lock },
  { label: "Subscription", icon: WalletCards },
  { label: "Billing", icon: CreditCard },
  { label: "Data & Storage", icon: Database },
  { label: "Help & Support", icon: HelpCircle },
];

const preferenceRows = [
  { label: "Target Exam", value: "FAST-NUCES", icon: CalendarClock },
  { label: "Preferred Subjects", value: "4 selected", icon: SlidersHorizontal },
  { label: "Difficulty Level", value: "Medium", icon: Palette },
  { label: "Daily Study Goal", value: "90 minutes", icon: CalendarClock },
  { label: "Week Start Day", value: "Monday", icon: CalendarClock },
];

const notificationRows = [
  { title: "Study Reminders", meta: "Daily goals & streak updates", enabled: true },
  { title: "Mock Test Alerts", meta: "Upcoming tests & results", enabled: true },
  { title: "Performance Updates", meta: "Weekly progress & insights", enabled: true },
  { title: "Promotions & News", meta: "Offers, new features & tips", enabled: false },
];

export default function SettingsPage() {
  return (
    <main className="mx-auto grid max-w-[96rem] gap-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="rounded-[1.35rem] border border-[#e4e9f6] bg-white/86 p-4 shadow-[0_24px_70px_rgba(36,52,104,0.07)] backdrop-blur-2xl xl:sticky xl:top-24 xl:h-fit">
        <h1 className="px-2 pb-4 font-display text-2xl font-bold text-[#07102e]">Settings</h1>
        <nav className="space-y-1" aria-label="Settings sections">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`flex h-11 w-full items-center gap-3 rounded-[0.8rem] px-3 text-left text-sm font-bold transition ${
                  item.active ? "bg-[#f0f1ff] text-blue-700" : "text-[#263457] hover:bg-[#f8faff]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <Link href="/dashboard" className="mt-5 flex h-12 items-center gap-3 rounded-[0.85rem] border border-[#e4e9f6] px-4 text-sm font-bold text-rose-600 hover:bg-rose-50">
          Log out
        </Link>
      </aside>

      <section className="space-y-5">
        <ProfileCard />

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Study Preferences" subtitle="Customize your learning experience.">
            <div className="space-y-2">
              {preferenceRows.map((row) => {
                const Icon = row.icon;
                return (
                  <button key={row.label} type="button" className="flex w-full items-center gap-3 rounded-[0.9rem] p-3 text-left transition hover:bg-[#f8faff]">
                    <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-bold text-[#101936]">{row.label}</span>
                    <span className="ml-auto text-sm font-semibold text-[#53618d]">{row.value}</span>
                    <ChevronRight className="h-4 w-4 text-[#7a86aa]" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Notifications" subtitle="Control what you want to be notified about." action="Manage all">
            <div className="space-y-3">
              {notificationRows.map((row) => (
                <div key={row.title} className="flex items-center gap-3 rounded-[0.9rem] p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] bg-[#f1f4ff] text-[#53618d]">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-[#101936]">{row.title}</span>
                    <span className="text-sm text-[#53618d]">{row.meta}</span>
                  </span>
                  <span className={`ml-auto flex h-6 w-11 items-center rounded-full p-1 transition ${row.enabled ? "bg-gradient-to-r from-blue-600 to-violet-600" : "bg-[#dfe5f0]"}`}>
                    <span className={`h-4 w-4 rounded-full bg-white transition ${row.enabled ? "translate-x-5" : ""}`} />
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Appearance" subtitle="Choose how Aptrive looks for you.">
            <div className="grid gap-4 sm:grid-cols-3">
              <AppearanceOption title="Light" icon={Sun} selected />
              <AppearanceOption title="Dark" icon={Moon} />
              <AppearanceOption title="System" icon={Cloud} meta="Auto" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#53618d]">Accent Color</p>
            <div className="mt-3 flex gap-5">
              {["#5b36ff", "#1685f8", "#10b981", "#f97316", "#f43f72"].map((color, index) => (
                <span key={color} className="grid h-7 w-7 place-items-center rounded-full" style={{ backgroundColor: color }}>
                  {index === 0 && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Privacy & Security" subtitle="Manage your privacy and keep your account secure.">
            <SecurityRow label="Change Password" icon={KeyRound} />
            <SecurityRow label="Two-Factor Authentication" icon={ShieldCheck} value="On" />
            <SecurityRow label="Active Sessions" icon={Lock} value="3 sessions" />
          </Panel>

          <Panel title="Subscription" subtitle="You're currently on the Pro Plan.">
            <div className="flex items-center gap-4 rounded-[1rem] bg-[#fafbff] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-[0.85rem] bg-violet-100 text-violet-600">
                <WalletCards className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-[#101936]">Pro Plan</p>
                <p className="text-sm text-[#53618d]">Renews on 12 May, 2027</p>
              </div>
              <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
            </div>
          </Panel>

          <Panel title="Data & Storage" subtitle="Manage your data and storage preferences.">
            <div className="flex items-center gap-4 rounded-[1rem] bg-[#fafbff] p-4">
              <span className="grid h-11 w-11 place-items-center rounded-[0.85rem] bg-blue-50 text-blue-600">
                <Database className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-[#101936]">Download My Data</p>
                <p className="text-sm text-[#53618d]">Export your data</p>
              </div>
              <button className="ml-auto rounded-[0.75rem] border border-[#dfe5f4] px-4 py-2 text-xs font-bold text-blue-700">Request Export</button>
            </div>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function ProfileCard() {
  return (
    <section className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#07102e]">Profile Information</h2>
          <p className="mt-1 text-sm text-[#53618d]">Manage your personal information and profile.</p>
        </div>
        <Link href="/profile" className="inline-flex h-11 items-center gap-2 rounded-[0.75rem] border border-[#dfe5f4] px-4 text-sm font-bold text-blue-700 hover:bg-[#f8faff]">
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit Profile
        </Link>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[6rem_repeat(4,minmax(0,1fr))] md:items-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-2xl font-bold text-white">DF</span>
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
    <section className="rounded-[1.35rem] border border-[#e4e9f6] bg-white p-6 shadow-[0_24px_70px_rgba(36,52,104,0.07)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#07102e]">{title}</h2>
          <p className="mt-1 text-sm text-[#53618d]">{subtitle}</p>
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
      <p className="text-sm font-semibold text-[#657199]">{label}</p>
      <p className="mt-2 font-bold text-[#101936]">{value}</p>
    </div>
  );
}

function AppearanceOption({ title, icon: Icon, selected, meta }: { title: string; icon: typeof Sun; selected?: boolean; meta?: string }) {
  return (
    <button className={`relative grid min-h-24 place-items-center rounded-[1rem] border p-4 text-center transition ${selected ? "border-blue-600 bg-[#f7f8ff]" : "border-[#e4e9f6] hover:bg-[#f8faff]"}`}>
      {selected && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-blue-600"><Check className="h-3 w-3 text-white" /></span>}
      <Icon className="h-6 w-6 text-[#53618d]" />
      <span className="text-sm font-bold text-[#101936]">{title}</span>
      {meta && <span className="text-xs text-[#53618d]">{meta}</span>}
    </button>
  );
}

function SecurityRow({ label, icon: Icon, value }: { label: string; icon: typeof Lock; value?: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-[0.9rem] p-3 text-left transition hover:bg-[#f8faff]">
      <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] bg-[#f1f4ff] text-[#53618d]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-bold text-[#101936]">{label}</span>
      {value && <span className="ml-auto text-sm font-bold text-emerald-600">{value}</span>}
      <ChevronRight className="h-4 w-4 text-[#7a86aa]" />
    </button>
  );
}
