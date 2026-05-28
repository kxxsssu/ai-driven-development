import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .max(255, "이메일은 255자 이하여야 합니다.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(50, "비밀번호는 50자 이하여야 합니다."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "닉네임은 2자 이상이어야 합니다.")
      .max(20, "닉네임은 20자 이하여야 합니다."),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .max(255, "이메일은 255자 이하여야 합니다.")
      .email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(50, "비밀번호는 50자 이하여야 합니다.")
      .regex(/[a-zA-Z]/, "비밀번호에 영문을 포함해주세요.")
      .regex(/[0-9]/, "비밀번호에 숫자를 포함해주세요."),
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
