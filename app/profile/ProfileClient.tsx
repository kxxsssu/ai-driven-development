"use client";

import { Loader2 } from "lucide-react";
import { FeedHeader } from "@/app/FeedHeader";
import { useProfile } from "@/hooks/use-profile";
import { ProfileHeader } from "@/app/profile/ProfileHeader";
import { ProfileGrid } from "@/app/profile/ProfileGrid";

interface IProfileClientProps {
  id: string;
}

export function ProfileClient({ id }: IProfileClientProps) {
  const { data: user, isLoading, isError } = useProfile(id);
  // "me" 프로필에서만 빈 상태에 생성 버튼을 노출한다.
  const isOwnProfile = id === "me";

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <main className="mx-auto max-w-[1600px] px-6 pb-10">
        {isLoading && (
          <div className="flex justify-center py-32">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-label="프로필 로딩 중"
            />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-xl font-semibold">
              사용자를 찾을 수 없습니다
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              존재하지 않는 프로필입니다.
            </p>
          </div>
        )}

        {user && (
          <>
            <ProfileHeader user={user} />
            <div className="border-t border-border/60 pt-8">
              <ProfileGrid id={id} showCreateOnEmpty={isOwnProfile} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
