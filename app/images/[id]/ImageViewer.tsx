"use client";

import Image from "next/image";

interface IImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: IImageViewerProps) {
  return (
    <div className="flex justify-center overflow-hidden rounded-2xl border border-border bg-surface">
      <Image
        src={src}
        alt={alt}
        width={640}
        height={640}
        className="h-auto max-h-[min(480px,55vh)] w-auto max-w-full object-contain animate-in fade-in duration-500"
        sizes="(max-width: 1024px) 100vw, 640px"
        priority
      />
    </div>
  );
}
