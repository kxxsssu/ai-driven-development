"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useGenerationStore } from "@/store/generation-store";

export function GenerationLoadingOverlay() {
  const loading = useGenerationStore((state) => state.loading);
  const progress = useGenerationStore((state) => state.progress);
  const selectedStyle = useGenerationStore((state) => state.selectedStyle);

  return (
    <Dialog open={loading}>
      <DialogContent
        className="flex flex-col items-center gap-6 border-border bg-surface py-10 sm:max-w-sm [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-lg">Generating Artwork...</DialogTitle>

        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-primary to-accent" />
          <span className="relative text-xl font-bold text-primary-foreground">
            {progress}%
          </span>
        </div>

        <div className="w-full px-2">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {selectedStyle && (
            <p>
              Style: <span className="text-foreground">{selectedStyle}</span>
            </p>
          )}
          <p className="mt-1">AI가 이미지를 생성하고 있어요</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
