import { AppLayout } from "@/components/AppLayout";
import { PageSkeleton } from "@/components/PageSkeleton";
export default function Loading() {
  return <AppLayout><div className="workspace-page"><PageSkeleton kind="overview" /></div></AppLayout>;
}
