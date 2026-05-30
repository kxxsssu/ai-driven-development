"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IProfileUser } from "@/types";

interface IProfileHeaderProps {
  user: IProfileUser;
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold">{value.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function ProfileHeader({ user }: IProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.avatarUrl ?? undefined} alt="" />
        <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-xl font-bold">{user.name}</h1>
        {user.bio && (
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center gap-10">
        <StatItem label="업로드" value={user.uploadCount} />
        <StatItem label="좋아요" value={user.likeCount} />
      </div>
    </div>
  );
}
