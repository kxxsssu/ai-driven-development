import { Sparkles } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-3 pb-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
        <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">CanvasHub</h1>
      <p className="text-sm text-muted-foreground">Create. Share. Inspire.</p>
    </div>
  );
}
