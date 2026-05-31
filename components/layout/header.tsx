"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images, LogOut, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/gallery",
    label: "내 갤러리",
    icon: Images,
    match: (pathname: string) => pathname.startsWith("/gallery"),
  },
  {
    href: "/profile",
    label: "프로필",
    icon: User,
    match: (pathname: string) => pathname.startsWith("/profile"),
  },
  {
    href: "/create",
    label: "이미지 생성",
    icon: Sparkles,
    match: (pathname: string) => pathname.startsWith("/create"),
  },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="CanvasHub 홈"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" aria-hidden />
          </div>
          <span className="font-semibold tracking-tight">CanvasHub</span>
        </Link>

        <nav
          className="flex shrink-0 items-center gap-2"
          aria-label="주요 메뉴"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
            const isActive = match(pathname);
            const isCreate = href === "/create";

            return (
              <Button
                key={href}
                variant={isCreate ? "default" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "gap-2",
                  !isCreate &&
                    isActive &&
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Link href={href} aria-current={isActive ? "page" : undefined}>
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
