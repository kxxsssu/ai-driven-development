import type { IAuthUser } from "@/types";

interface IMockUser extends IAuthUser {
  password: string;
}

const DEFAULT_USERS: IMockUser[] = [
  {
    id: "user-1",
    name: "데모유저",
    email: "demo@canvashub.com",
    password: "password123",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  },
];

// Next.js는 각 Route Handler를 별도 번들로 컴파일하므로 모듈 변수는
// 라우트 간에 공유되지 않는다. globalThis에 저장해 단일 인스턴스를 공유한다.
const globalForAuth = globalThis as unknown as {
  __mockUsers__?: IMockUser[];
};

export const MOCK_USERS: IMockUser[] =
  globalForAuth.__mockUsers__ ?? (globalForAuth.__mockUsers__ = DEFAULT_USERS);

export const SESSION_COOKIE_NAME = "canvashub_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function findUserByEmail(email: string): IMockUser | undefined {
  return MOCK_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function toAuthUser(user: IMockUser): IAuthUser {
  const { password: _password, ...authUser } = user;
  return authUser;
}

export function createMockUser(
  name: string,
  email: string,
  password: string
): IMockUser {
  const newUser: IMockUser = {
    id: `user-${crypto.randomUUID()}`,
    name,
    email,
    password,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
  };
  MOCK_USERS.push(newUser);
  return newUser;
}

export function encodeSession(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString("base64url");
}

export function decodeSession(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [userId] = decoded.split(":");
    return userId || null;
  } catch {
    return null;
  }
}
