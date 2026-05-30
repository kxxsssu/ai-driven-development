"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { IImageDetail } from "@/types";

interface IImageMetadataProps {
  image: IImageDetail;
}

export function ImageMetadata({ image }: IImageMetadataProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={image.author.avatarUrl} alt="" />
          <AvatarFallback>{image.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{image.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(image.createdAt)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-1.5 text-xs font-medium text-muted-foreground">
          Prompt
        </h2>
        <p className="whitespace-pre-wrap break-words rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-foreground/90">
          {image.prompt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{image.style}</Badge>
        <Badge variant="outline">{image.ratio}</Badge>
        <Badge variant="outline">
          {image.isPublic ? "Public" : "Private"}
        </Badge>
      </div>
    </div>
  );
}
