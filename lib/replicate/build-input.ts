import { MAX_COUNT, MIN_COUNT } from "@/lib/generation-options";
import type {
  FluxSchnellAspectRatio,
  IFluxSchnellInput,
} from "@/lib/replicate/flux-schnell-schema";
import { FLUX_SCHNELL_DEFAULTS } from "@/lib/replicate/flux-schnell-schema";
import type { ImageRatio, ImageStyle } from "@/types";

/**
 * ImageStyle은 flux-schnell schema에 없는 앱 전용 옵션이다.
 * 모델에는 prompt 문자열 suffix로 스타일을 반영한다.
 */
const STYLE_SUFFIX: Record<ImageStyle, string> = {
  Anime: "anime style illustration, vibrant colors",
  Realistic: "photorealistic, highly detailed, natural lighting",
  Fantasy: "fantasy art, magical atmosphere, epic composition",
  Cyberpunk: "cyberpunk, neon lights, futuristic cityscape",
  "Oil Painting": "oil painting, textured brushstrokes, classical art",
};

/** ImageRatio는 flux aspect_ratio enum의 부분집합 (1:1, 16:9, 9:16) */
const APP_RATIO_TO_FLUX: Record<ImageRatio, FluxSchnellAspectRatio> = {
  "1:1": "1:1",
  "16:9": "16:9",
  "9:16": "9:16",
};

export function buildStyledPrompt(prompt: string, style: ImageStyle): string {
  return `${prompt.trim()}, ${STYLE_SUFFIX[style]}`;
}

function clampCount(count: number): number {
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(count)));
}

export function buildReplicateInput(params: {
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
}): IFluxSchnellInput {
  return {
    prompt: buildStyledPrompt(params.prompt, params.style),
    aspect_ratio: APP_RATIO_TO_FLUX[params.ratio],
    num_outputs: clampCount(params.count),
    num_inference_steps: FLUX_SCHNELL_DEFAULTS.num_inference_steps,
    go_fast: FLUX_SCHNELL_DEFAULTS.go_fast,
    megapixels: FLUX_SCHNELL_DEFAULTS.megapixels,
    output_format: FLUX_SCHNELL_DEFAULTS.output_format,
    output_quality: FLUX_SCHNELL_DEFAULTS.output_quality,
    disable_safety_checker: FLUX_SCHNELL_DEFAULTS.disable_safety_checker,
  };
}
