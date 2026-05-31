"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { ILoginResponse } from "@/types";

function getSafeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: ILoginResponse = await response.json();

      if (!data.success) {
        toast.error(data.error);
        form.resetField("password");
        form.setFocus("email");
        return;
      }

      toast.success(`${data.user.name}님, 환영합니다!`);
      router.push(getSafeRedirect(searchParams.get("redirect")));
      router.refresh();
    } catch {
      toast.error("잠시 후 다시 시도해주세요.");
      form.resetField("password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12"
                    aria-label="이메일"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-12"
                    aria-label="비밀번호"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-2 h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}
