import { FeedSkeleton } from "@/app/FeedSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border/60" />
      <div className="h-12 border-b border-border/60" />
      <div className="px-4 py-6 md:px-6">
        <FeedSkeleton />
      </div>
    </div>
  );
}
