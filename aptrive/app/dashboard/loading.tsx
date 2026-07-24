export default function DashboardLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-8 md:px-6 md:py-10">
      <div className="container-aptrive grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Welcome + daily goal — shimmer, since these are the first
            thing a visitor looks at */}
        <div className="rounded-md border border-line bg-panel p-6 md:p-8 lg:col-span-8">
          <div className="shimmer h-3 w-32 rounded-sm" />
          <div className="shimmer mt-4 h-10 w-80 max-w-full rounded-sm" />
          <div className="shimmer mt-3 h-4 w-full max-w-xl rounded-sm" />
          <div className="mt-6 flex gap-3">
            <div className="shimmer h-9 w-40 rounded-sm" />
            <div className="shimmer h-9 w-36 rounded-sm" />
          </div>
        </div>
        <div className="rounded-md border border-line bg-panel p-6 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="shimmer h-3 w-20 rounded-sm" />
              <div className="shimmer mt-3 h-7 w-24 rounded-sm" />
            </div>
            <div className="shimmer h-20 w-20 rounded-full" />
          </div>
        </div>

        {/* KPI cells — plain pulse skeleton, secondary content */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-span-1 rounded-md border border-line bg-panel p-5 sm:col-span-6 lg:col-span-3">
            <div className="skeleton h-3 w-20 rounded-sm" />
            <div className="skeleton mt-3 h-7 w-16 rounded-sm" />
          </div>
        ))}

        {/* Trends + readiness ring */}
        <div className="rounded-md border border-line bg-panel p-6 lg:col-span-7">
          <div className="skeleton h-4 w-40 rounded-sm" />
          <div className="skeleton mt-5 h-24 w-full rounded-sm" />
        </div>
        <div className="rounded-md border border-line bg-panel p-6 lg:col-span-5">
          <div className="skeleton h-4 w-32 rounded-sm" />
          <div className="mt-5 flex items-center gap-6">
            <div className="skeleton h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-full rounded-sm" />
              <div className="skeleton h-3 w-4/5 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Topic + goal cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-line bg-panel p-5 lg:col-span-4">
            <div className="skeleton h-4 w-28 rounded-sm" />
            <div className="mt-4 space-y-3">
              <div className="skeleton h-3 w-full rounded-sm" />
              <div className="skeleton h-3 w-full rounded-sm" />
              <div className="skeleton h-3 w-3/4 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
