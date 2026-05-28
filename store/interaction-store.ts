import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IComment } from "@/types/feed";

interface IInteractionStore {
  likedIds: Record<string, boolean>;
  comments: Record<string, IComment[]>;
  toggleLike: (imageId: string) => void;
  addComment: (imageId: string, author: string, text: string) => void;
  isLiked: (imageId: string) => boolean;
  getComments: (imageId: string) => IComment[];
}

export const useInteractionStore = create<IInteractionStore>()(
  persist(
    (set, get) => ({
      likedIds: {},
      comments: {},

      toggleLike: (imageId) =>
        set((state) => ({
          likedIds: {
            ...state.likedIds,
            [imageId]: !state.likedIds[imageId],
          },
        })),

      addComment: (imageId, author, text) =>
        set((state) => {
          const newComment: IComment = {
            id: `comment-${crypto.randomUUID()}`,
            imageId,
            author,
            text,
            createdAt: new Date().toISOString(),
          };
          return {
            comments: {
              ...state.comments,
              [imageId]: [...(state.comments[imageId] ?? []), newComment],
            },
          };
        }),

      isLiked: (imageId) => Boolean(get().likedIds[imageId]),
      getComments: (imageId) => get().comments[imageId] ?? [],
    }),
    {
      name: "canvashub-interactions",
    }
  )
);
