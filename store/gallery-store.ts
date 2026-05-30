import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GalleryTab, GallerySort, Visibility } from "@/types";

interface IGalleryStore {
  activeTab: GalleryTab;
  sort: GallerySort;
  // 공개/비공개 토글의 낙관적 결과를 보관한다. (목업: 서버 미반영분 보정)
  visibilityOverrides: Record<string, Visibility>;
  setActiveTab: (tab: GalleryTab) => void;
  setSort: (sort: GallerySort) => void;
  setVisibility: (id: string, visibility: Visibility) => void;
  getVisibility: (id: string, base: Visibility) => Visibility;
}

export const useGalleryStore = create<IGalleryStore>()(
  persist(
    (set, get) => ({
      activeTab: "all",
      sort: "latest",
      visibilityOverrides: {},

      setActiveTab: (activeTab) => set({ activeTab }),
      setSort: (sort) => set({ sort }),

      setVisibility: (id, visibility) =>
        set((state) => ({
          visibilityOverrides: {
            ...state.visibilityOverrides,
            [id]: visibility,
          },
        })),

      getVisibility: (id, base) => get().visibilityOverrides[id] ?? base,
    }),
    {
      name: "canvashub-gallery",
      storage: createJSONStorage(() => localStorage),
      // 공개 토글 결과만 영속한다. (탭/정렬은 세션 단위 UI 상태)
      partialize: (state) => ({
        visibilityOverrides: state.visibilityOverrides,
      }),
    }
  )
);
