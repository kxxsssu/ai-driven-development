/**
 * black-forest-labs/flux-schnell Replicate input schema
 * @see https://replicate.com/black-forest-labs/flux-schnell
 */

export const FLUX_SCHNELL_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "21:9",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "3:4",
  "4:3",
  "9:16",
  "9:21",
] as const;

export type FluxSchnellAspectRatio = (typeof FLUX_SCHNELL_ASPECT_RATIOS)[number];

export type FluxSchnellOutputFormat = "webp" | "jpg" | "png";

export type FluxSchnellMegapixels = "1" | "0.25";

/** flux-schnell predictions.create input (schema-aligned) */
export interface IFluxSchnellInput {
  /** Required. User prompt + style suffix (style is not a separate schema field). */
  prompt: string;
  aspect_ratio: FluxSchnellAspectRatio;
  num_outputs: number;
  num_inference_steps?: number;
  seed?: number;
  go_fast?: boolean;
  megapixels?: FluxSchnellMegapixels;
  output_format?: FluxSchnellOutputFormat;
  output_quality?: number;
  disable_safety_checker?: boolean;
}

export const FLUX_SCHNELL_DEFAULTS = {
  aspect_ratio: "1:1" as const,
  num_outputs: 1,
  num_inference_steps: 4,
  go_fast: true,
  megapixels: "1" as const,
  output_format: "webp" as const,
  output_quality: 80,
  disable_safety_checker: false,
} satisfies Partial<IFluxSchnellInput>;

export const FLUX_SCHNELL_LIMITS = {
  num_outputs: { min: 1, max: 4 },
  num_inference_steps: { min: 1, max: 4 },
  output_quality: { min: 0, max: 100 },
} as const;
