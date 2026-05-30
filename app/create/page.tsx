import type { Metadata } from "next";
import { FeedHeader } from "@/app/FeedHeader";
import { PromptSection } from "@/app/create/PromptSection";
import { StyleSelector } from "@/app/create/StyleSelector";
import { RatioSelector } from "@/app/create/RatioSelector";
import { GenerationCountStepper } from "@/app/create/GenerationCountStepper";
import { GenerateButton } from "@/app/create/GenerateButton";
import { GeneratedResultGrid } from "@/app/create/GeneratedResultGrid";
import { GenerationLoadingOverlay } from "@/app/create/GenerationLoadingOverlay";

export const metadata: Metadata = {
  title: "이미지 생성 — CanvasHub",
  description: "AI로 원하는 스타일의 이미지를 생성하세요.",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">이미지 생성</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            프롬프트와 스타일을 입력하고 AI 이미지를 만들어 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface/50 p-6">
            <PromptSection />
            <StyleSelector />
            <RatioSelector />
            <GenerationCountStepper />
            <GenerateButton />
          </section>

          <section className="flex flex-col gap-8">
            <GeneratedResultGrid />
          </section>
        </div>
      </main>

      <GenerationLoadingOverlay />
    </div>
  );
}
