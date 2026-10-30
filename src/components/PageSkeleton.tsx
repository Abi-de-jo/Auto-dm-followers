import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton({ kind = "overview" }: { kind?: "overview" | "replies" | "stories" | "leads" }) {
  const threeCards = kind === "stories" || kind === "leads";
  return (
    <div role="status" aria-label="Loading your page" className="page-skeleton space-y-8">
      <span className="sr-only">Loading your page. Please wait.</span>
      <div aria-hidden="true" className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3"><Skeleton className="h-9 w-48" /><Skeleton className="h-4 w-64 max-w-full" /></div>
          <Skeleton className="h-11 w-32" />
        </div>
        <div className={`grid gap-4 ${threeCards ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
          {Array.from({ length: threeCards ? 3 : 4 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-5 space-y-4">
              <Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-16" /><Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        {kind === "overview" ? (
          <div className="rounded-2xl border border-white/10 p-5 space-y-5">
            <Skeleton className="h-5 w-40" /><Skeleton className="h-64 w-full" />
            {[0, 1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : kind === "leads" ? (
          <div className="rounded-2xl border border-white/10 p-5 space-y-4">
            <Skeleton className="h-10 w-full" />
            {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map(i => <div key={i} className="rounded-2xl border border-white/10 p-5 space-y-5"><Skeleton className="h-14 w-14" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-24 w-full" /><Skeleton className="h-10 w-full" /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
