"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGalleryStore } from "@/store/gallery-store";
import type { GalleryTab } from "@/types";

const TAB_ITEMS: { value: GalleryTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "public", label: "공개" },
  { value: "private", label: "비공개" },
];

export function GalleryTabs() {
  const activeTab = useGalleryStore((state) => state.activeTab);
  const setActiveTab = useGalleryStore((state) => state.setActiveTab);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as GalleryTab)}
    >
      <TabsList>
        {TAB_ITEMS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
