import { AlertCircle } from "lucide-react";

export function PageLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-100">
      <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
      <p className="flex-1">We couldn’t load the latest information. Please try again.</p>
      <button type="button" onClick={onRetry} className="rounded-xl border border-rose-200/30 px-4 py-2 font-semibold hover:bg-rose-200/10">Try again</button>
    </div>
  );
}
