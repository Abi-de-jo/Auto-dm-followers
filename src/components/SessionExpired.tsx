import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function SessionExpired() {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100"
    >
      <LockKeyhole aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-300" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-amber-50">Your session has expired</p>
        <p className="mt-0.5 text-xs text-amber-100/80">
          Please log in again to continue where you left off.
        </p>
      </div>
      <Link
        href="/login?expired=1"
        className="rounded-xl border border-amber-200/30 px-4 py-2 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-200/10"
      >
        Log in again
      </Link>
    </div>
  );
}
