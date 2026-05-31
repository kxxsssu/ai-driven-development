import type { Prediction } from "replicate";
import type {
  IGeneratedImage,
  IGenerateStatusResponse,
  ImageRatio,
  ImageStyle,
} from "@/types";
import { buildReplicateInput } from "@/lib/replicate/build-input";
import {
  FLUX_SCHNELL_MODEL,
  getReplicateClient,
} from "@/lib/replicate/client";

interface IGenerationJob {
  id: string;
  userId: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
  createdAt: number;
  replicatePredictionId: string;
  cachedStatus?: IGenerateStatusResponse;
}

const globalForJobs = globalThis as unknown as {
  __generationJobs__?: Map<string, IGenerationJob>;
};

const jobs: Map<string, IGenerationJob> =
  globalForJobs.__generationJobs__ ??
  (globalForJobs.__generationJobs__ = new Map());

const ESTIMATED_DURATION_MS = 20000;

function extractOutputUrls(output: unknown): string[] {
  if (!output) return [];
  if (Array.isArray(output)) {
    return output.filter((url): url is string => typeof url === "string");
  }
  if (typeof output === "string") return [output];
  return [];
}

function buildImages(job: IGenerationJob, urls: string[]): IGeneratedImage[] {
  const createdAt = new Date().toISOString();

  return urls.map((url, index) => ({
    id: `${job.id}_img_${index + 1}`,
    url,
    style: job.style,
    ratio: job.ratio,
    prompt: job.prompt,
    createdAt,
  }));
}

function estimateProgress(createdAt: number): number {
  const elapsed = Date.now() - createdAt;
  return Math.min(95, Math.floor(10 + (elapsed / ESTIMATED_DURATION_MS) * 85));
}

function mapPredictionToStatus(
  job: IGenerationJob,
  prediction: Prediction
): IGenerateStatusResponse {
  switch (prediction.status) {
    case "starting":
      return { status: "processing", progress: 15, images: [] };
    case "processing":
      return {
        status: "processing",
        progress: estimateProgress(job.createdAt),
        images: [],
      };
    case "succeeded": {
      const images = buildImages(job, extractOutputUrls(prediction.output));
      return { status: "completed", progress: 100, images };
    }
    case "failed":
    case "canceled":
      return { status: "failed", progress: 0, images: [] };
    default:
      return { status: "queued", progress: 5, images: [] };
  }
}

export async function createGenerationJob(params: {
  userId: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
}): Promise<string> {
  const replicate = getReplicateClient();
  const jobId = `job_${crypto.randomUUID()}`;

  const prediction = await replicate.predictions.create({
    model: FLUX_SCHNELL_MODEL,
    input: buildReplicateInput(params),
  });

  if (prediction.error) {
    throw new Error(
      typeof prediction.error === "string"
        ? prediction.error
        : "Replicate prediction failed"
    );
  }

  jobs.set(jobId, {
    id: jobId,
    userId: params.userId,
    prompt: params.prompt,
    style: params.style,
    ratio: params.ratio,
    count: params.count,
    createdAt: Date.now(),
    replicatePredictionId: prediction.id,
  });

  return jobId;
}

export async function getGenerationJobStatus(
  jobId: string,
  userId: string
): Promise<IGenerateStatusResponse | null> {
  const job = jobs.get(jobId);
  if (!job || job.userId !== userId) return null;

  if (job.cachedStatus) {
    return job.cachedStatus;
  }

  const replicate = getReplicateClient();
  const prediction = await replicate.predictions.get(job.replicatePredictionId);
  const status = mapPredictionToStatus(job, prediction);

  if (status.status === "completed" || status.status === "failed") {
    job.cachedStatus = status;
  }

  return status;
}
