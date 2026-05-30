import { create } from "zustand";
import { toast } from "sonner";
import type {
  IGeneratedImage,
  IGenerateCreateResponse,
  IGenerateStatusResponse,
  ImageRatio,
  ImageStyle,
} from "@/types";
import { MAX_COUNT, MIN_COUNT } from "@/lib/generation-options";

const POLL_INTERVAL_MS = 800;
const POLL_TIMEOUT_MS = 30000;

interface IGenerationStore {
  prompt: string;
  selectedStyle: ImageStyle | null;
  ratio: ImageRatio;
  count: number;
  loading: boolean;
  progress: number;
  generatedImages: IGeneratedImage[];

  setPrompt: (prompt: string) => void;
  setStyle: (style: ImageStyle) => void;
  setRatio: (ratio: ImageRatio) => void;
  setCount: (count: number) => void;
  canGenerate: () => boolean;
  generate: () => Promise<void>;
  reuseSettings: (image: IGeneratedImage) => void;
}

export const useGenerationStore = create<IGenerationStore>((set, get) => ({
  prompt: "",
  selectedStyle: null,
  ratio: "1:1",
  count: 1,
  loading: false,
  progress: 0,
  generatedImages: [],

  setPrompt: (prompt) => set({ prompt }),
  setStyle: (selectedStyle) => set({ selectedStyle }),
  setRatio: (ratio) => set({ ratio }),
  setCount: (count) =>
    set({ count: Math.min(MAX_COUNT, Math.max(MIN_COUNT, count)) }),

  canGenerate: () => {
    const { prompt, selectedStyle, loading } = get();
    return !loading && prompt.trim().length > 0 && selectedStyle !== null;
  },

  generate: async () => {
    const { prompt, selectedStyle, ratio, count, loading } = get();
    if (loading || !selectedStyle || prompt.trim().length === 0) return;

    set({ loading: true, progress: 0 });

    try {
      const createRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style: selectedStyle, ratio, count }),
      });

      if (!createRes.ok) {
        throw new Error("생성 요청에 실패했습니다.");
      }

      const { jobId }: IGenerateCreateResponse = await createRes.json();

      const startedAt = Date.now();

      await new Promise<void>((resolve, reject) => {
        const poll = async () => {
          try {
            if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
              reject(new Error("생성 시간이 초과되었습니다."));
              return;
            }

            const statusRes = await fetch(`/api/generate/${jobId}`);
            if (!statusRes.ok) {
              throw new Error("생성 상태 조회에 실패했습니다.");
            }

            const data: IGenerateStatusResponse = await statusRes.json();
            set({ progress: data.progress });

            if (data.status === "completed") {
              set({ generatedImages: data.images, progress: 100 });
              resolve();
              return;
            }

            if (data.status === "failed") {
              reject(new Error("이미지 생성에 실패했습니다."));
              return;
            }

            setTimeout(poll, POLL_INTERVAL_MS);
          } catch (error) {
            reject(error);
          }
        };

        void poll();
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "잠시 후 다시 시도해주세요."
      );
    } finally {
      set({ loading: false });
    }
  },

  reuseSettings: (image) =>
    set({ prompt: image.prompt, selectedStyle: image.style, ratio: image.ratio }),
}));
