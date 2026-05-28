import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_HEIGHTS = [280, 360, 320, 400, 300, 380, 340, 420];

export function FeedSkeleton() {
  return (
    <div
      className="columns-3 gap-4 lg:columns-4 2xl:columns-6"
      aria-busy="true"
      aria-label="피드 로딩 중"
    >
      {SKELETON_HEIGHTS.map((height, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"
        >
          <Skeleton
            className="w-full rounded-2xl"
            style={{ height: `${height}px` }}
          />
        </div>
      ))}
    </div>
  );
}
