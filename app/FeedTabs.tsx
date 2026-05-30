"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeedStore } from "@/store/feed-store";
import type { FeedTab } from "@/types";

const TAB_ITEMS: { value: FeedTab; label: string }[] = [
  { value: "trending", label: "인기" },
  { value: "latest", label: "최신" },
];

export function FeedTabs() {
  const { activeTab, setActiveTab } = useFeedStore();

  return (
    <div className="border-b border-border/60 bg-background">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FeedTab)}
        className="mx-auto max-w-[1600px] px-4 md:px-6"
      >
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative rounded-none border-0 bg-transparent px-0 pb-3 pt-4 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform data-[state=active]:after:scale-x-100"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
