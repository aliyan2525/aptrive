export default function LibraryLoading() {
  return (
    <section className="container-aptrive py-16 md:py-24">
      <div className="animate-pulse">
        <div className="skeleton h-4 w-20 rounded-sm" />
        <div className="skeleton mt-4 h-12 w-96 max-w-full rounded-sm" />
        <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-sm" />

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-8 w-16 rounded-sm" />
              <div className="skeleton mt-2 h-3 w-24 rounded-sm" />
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-md border border-line bg-panel p-6">
              <div className="skeleton h-6 w-32 rounded-sm" />
              <div className="skeleton mt-3 h-4 w-full rounded-sm" />
              <div className="skeleton mt-2 h-4 w-4/5 rounded-sm" />
              <div className="skeleton mt-6 h-3 w-24 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
