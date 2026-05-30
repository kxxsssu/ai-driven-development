import type { ImageStyle, ImageRatio } from "@/types";

export const STYLE_OPTIONS: ImageStyle[] = [
  "Anime",
  "Realistic",
  "Fantasy",
  "Cyberpunk",
  "Oil Painting",
];

export const RATIO_OPTIONS: ImageRatio[] = ["1:1", "16:9", "9:16"];

export const MIN_COUNT = 1;
export const MAX_COUNT = 4;
export const MAX_PROMPT_LENGTH = 500;

const RATIO_DIMENSIONS: Record<ImageRatio, { width: number; height: number }> =
  {
    "1:1": { width: 600, height: 600 },
    "16:9": { width: 800, height: 450 },
    "9:16": { width: 450, height: 800 },
  };

export function getRatioDimensions(ratio: ImageRatio) {
  return RATIO_DIMENSIONS[ratio];
}

// 진행률 구간별 로딩 상태 메시지.
// 대기 시간을 몰입형 경험으로 전환하기 위해 단계별로 안내 문구를 전환한다.
const GENERATION_STAGES: { threshold: number; message: string }[] = [
  { threshold: 25, message: "프롬프트를 분석하고 있어요" },
  { threshold: 60, message: "AI가 이미지를 그리고 있어요" },
  { threshold: 90, message: "디테일을 다듬고 있어요" },
  { threshold: 100, message: "거의 다 됐어요" },
];

export function getGenerationStatusMessage(progress: number): string {
  const stage = GENERATION_STAGES.find((s) => progress < s.threshold);
  return stage?.message ?? "곧 결과를 보여드릴게요";
}
