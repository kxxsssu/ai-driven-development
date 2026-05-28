import type { ImageStyle, ImageRatio } from "@/types/generation";

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

const STYLE_PREVIEW_SEED: Record<ImageStyle, string> = {
  Anime: "style-anime",
  Realistic: "style-realistic",
  Fantasy: "style-fantasy",
  Cyberpunk: "style-cyberpunk",
  "Oil Painting": "style-oil-painting",
};

export function getStylePreviewUrl(style: ImageStyle): string {
  return `https://picsum.photos/seed/${STYLE_PREVIEW_SEED[style]}/640/480`;
}

const RATIO_DIMENSIONS: Record<ImageRatio, { width: number; height: number }> =
  {
    "1:1": { width: 600, height: 600 },
    "16:9": { width: 800, height: 450 },
    "9:16": { width: 450, height: 800 },
  };

export function getRatioDimensions(ratio: ImageRatio) {
  return RATIO_DIMENSIONS[ratio];
}
