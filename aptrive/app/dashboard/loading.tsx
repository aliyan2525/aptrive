export default function DashboardLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-6 py-12">
      <div className="container-aptrive animate-pulse">
        <div className="skeleton h-4 w-24 rounded-sm" />
        <div className="skeleton mt-4 h-10 w-72 max-w-full rounded-sm" />
        <div className="skeleton mt-3 h-4 w-96 max-w-full rounded-sm" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-md border border-line bg-panel p-5">
              <div className="skeleton h-3 w-20 rounded-sm" />
              <div className="skeleton mt-3 h-8 w-16 rounded-sm" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-line bg-panel p-5">
              <div className="skeleton h-5 w-32 rounded-sm" />
              <div className="skeleton mt-3 h-4 w-full rounded-sm" />
              <div className="skeleton mt-2 h-4 w-4/5 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
