export type ImageStyle =
  | "Anime"
  | "Realistic"
  | "Fantasy"
  | "Cyberpunk"
  | "Oil Painting";

export type ImageRatio = "1:1" | "16:9" | "9:16";

export type GenerationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface IGeneratedImage {
  id: string;
  url: string;
  style: ImageStyle;
  ratio: ImageRatio;
  prompt: string;
  createdAt: string;
}

export interface IGenerateRequest {
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
}

export interface IGenerateCreateResponse {
  jobId: string;
  status: GenerationStatus;
}

export interface IGenerateStatusResponse {
  status: GenerationStatus;
  progress: number;
  images: IGeneratedImage[];
}
