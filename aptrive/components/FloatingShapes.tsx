export default function FloatingShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="float-a absolute -top-10 right-[6%] h-40 w-40 rounded-full border border-teal/20 bg-teal-dim/40 blur-[1px] md:h-56 md:w-56" />
      <div className="float-b absolute top-40 right-[22%] h-16 w-16 rotate-45 border border-gold/25 bg-gold-dim/30 md:h-24 md:w-24" />
      <div className="float-a absolute top-[55%] left-[2%] h-24 w-24 rounded-full border border-line-strong/60 md:h-32 md:w-32" />
      <div className="float-b absolute -bottom-6 right-[38%] h-12 w-12 rotate-12 border border-teal/20" />
    </div>
  );
}
