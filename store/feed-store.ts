import { create } from "zustand";
import type { FeedTab } from "@/types/feed";

interface IFeedStore {
  activeTab: FeedTab;
  setActiveTab: (tab: FeedTab) => void;
}

export const useFeedStore = create<IFeedStore>((set) => ({
  activeTab: "trending",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
