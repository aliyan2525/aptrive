const AVATARS = [
  { initials: "HR", from: "#22d3c8", to: "#0ea5a4" },
  { initials: "AK", from: "#f0b74a", to: "#c9922f" },
  { initials: "BS", from: "#818cf8", to: "#6366f1" },
  { initials: "SM", from: "#f472b6", to: "#db2777" },
];

export default function HeroAvatarStack() {
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {AVATARS.map((avatar) => (
        <div
          key={avatar.initials}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${avatar.from}, ${avatar.to})` }}
        >
          {avatar.initials}
        </div>
      ))}
    </div>
  );
}
