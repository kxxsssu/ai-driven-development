import type {
  IGeneratedImage,
  ImageRatio,
  ImageStyle,
} from "@/types/generation";
import { getRatioDimensions } from "@/lib/generation-options";

interface IMockJob {
  id: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  count: number;
  createdAt: number;
}

// Next.js Route Handler 간 상태 공유를 위해 globalThis에 Job 저장소를 둔다.
const globalForJobs = globalThis as unknown as {
  __generationJobs__?: Map<string, IMockJob>;
};

const jobs: Map<string, IMockJob> =
  globalForJobs.__generationJobs__ ??
  (globalForJobs.__generationJobs__ = new Map());

// 목업 생성 소요 시간(ms). 이 시간이 지나면 progress 100%로 완료된다.
const GENERATION_DURATION_MS = 4000;

export function createJob(params: Omit<IMockJob, "id" | "createdAt">): string {
  const id = `job_${crypto.randomUUID()}`;
  jobs.set(id, { ...params, id, createdAt: Date.now() });
  return id;
}

function buildImages(job: IMockJob): IGeneratedImage[] {
  const { width, height } = getRatioDimensions(job.ratio);
  const createdAt = new Date().toISOString();

  return Array.from({ length: job.count }, (_, index) => ({
    id: `${job.id}_img_${index + 1}`,
    url: `https://picsum.photos/seed/${job.id}-${index}/${width}/${height}`,
    style: job.style,
    ratio: job.ratio,
    prompt: job.prompt,
    createdAt,
  }));
}

export function getJobStatus(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) return null;

  const elapsed = Date.now() - job.createdAt;
  const progress = Math.min(
    100,
    Math.floor((elapsed / GENERATION_DURATION_MS) * 100)
  );

  if (progress >= 100) {
    return {
      status: "completed" as const,
      progress: 100,
      images: buildImages(job),
    };
  }

  return {
    status: "processing" as const,
    progress,
    images: [],
  };
}
