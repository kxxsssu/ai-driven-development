import { Sparkles } from "lucide-react";

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center gap-3 pb-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
        <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
      <p className="text-sm text-muted-foreground">
        CanvasHub와 함께 창작을 시작하세요.
      </p>
    </div>
  );
}
