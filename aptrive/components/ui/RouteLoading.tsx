export default function RouteLoading({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-transparent px-4 pb-16 pt-24 md:px-8" aria-busy="true" aria-label={label}>
      <div className="container-aptrive space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton h-12 w-3/4 rounded-2xl" />
          <div className="skeleton h-4 w-full max-w-xl rounded-full" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {["a", "b", "c", "d", "e", "f"].map((key) => (
            <div key={key} className="premium-shell min-h-48 rounded-[1.35rem] bg-white/60 p-6">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="mt-6 space-y-3">
                <div className="skeleton h-5 w-2/3 rounded-full" />
                <div className="skeleton h-3 w-full rounded-full" />
                <div className="skeleton h-3 w-4/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
