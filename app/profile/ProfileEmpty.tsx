import Link from "next/link";
import { ImageOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IProfileEmptyProps {
  showCreate?: boolean;
}

export function ProfileEmpty({ showCreate = true }: IProfileEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface">
        <ImageOff className="h-9 w-9 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold">아직 공개한 작품이 없어요</h2>
      {showCreate && (
        <Button asChild className="mt-6 gap-2">
          <Link href="/create">
            <Sparkles className="h-4 w-4" aria-hidden />
            이미지 생성하기
          </Link>
        </Button>
      )}
    </div>
  );
}
