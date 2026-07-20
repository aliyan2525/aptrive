const testimonials = [
  {
    quote:
      "I stopped guessing which chapters to revise. The topic-level analytics told me exactly where I was losing marks.",
    name: "Hamza Raza",
    detail: "NUST NET · Admitted, SEECS · Class of 2025",
    verified: true,
  },
  {
    quote:
      "The mock tests felt closer to the real exam than anything else I used. Timing pressure included.",
    name: "Areeba Khan",
    detail: "NUST NET · Admitted, SMME · Class of 2025",
    verified: true,
  },
  {
    quote:
      "Practicing weak topics first instead of starting from chapter one saved me weeks of prep time.",
    name: "Bilal Sheikh",
    detail: "NUST NET · Admitted, SCEE · Class of 2025",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className="flex flex-col rounded-md border border-line bg-panel p-6"
        >
          <div className="flex items-center justify-between">
            <div className="font-mono-data text-2xl text-teal">&ldquo;</div>
            {t.verified && (
              <span className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-teal">
                Verified student
              </span>
            )}
          </div>
          <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-fg">
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 border-t border-line pt-4">
            <div className="text-sm font-medium text-fg">{t.name}</div>
            <div className="mt-0.5 font-mono-data text-xs text-muted">
              {t.detail}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
