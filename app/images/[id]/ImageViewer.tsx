"use client";

import Image from "next/image";

interface IImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: IImageViewerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <Image
        src={src}
        alt={alt}
        width={1024}
        height={1024}
        className="h-auto w-full object-contain animate-in fade-in duration-500"
        sizes="(max-width: 1024px) 100vw, 1024px"
        priority
      />
    </div>
  );
}
