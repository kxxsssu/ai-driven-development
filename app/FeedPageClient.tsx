"use client";

import { FeedHeader } from "@/app/FeedHeader";
import { FeedTabs } from "@/app/FeedTabs";
import { FeedGrid } from "@/app/FeedGrid";

export function FeedPageClient() {
  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      <FeedTabs />
      <main>
        <FeedGrid />
      </main>
    </div>
  );
}
