# 로그인 Frontend 기능명세서

> **구현 반영 (Clerk 연동)**: 자체 이메일/비밀번호 폼 + 목업 API 대신
> [Clerk](https://clerk.com/docs/nextjs/getting-started/quickstart) 인증을
> 사용한다. `@clerk/nextjs@latest`, Next.js 15+, `proxy.ts` +
> `clerkMiddleware()` 기반이다.

---

# 1. 페이지 구조

## 라우트 구조

```bash
app/
 ├── layout.tsx              # ClerkProvider
 ├── login/
 │   ├── page.tsx
 │   ├── LoginForm.tsx       # Clerk <SignIn />
 │   ├── LoginHeader.tsx
 │   └── LoginBackground.tsx
 │
 └── register/
     ├── page.tsx
     ├── RegisterForm.tsx    # Clerk <SignUp />
     └── RegisterHeader.tsx

proxy.ts                      # clerkMiddleware + 보호 라우트
middleware.ts                 # proxy.ts re-export (Next.js 15 호환)
```

> `LoginBackground`는 회원가입 페이지에서도 재사용한다. Clerk `<SignIn>` /
> `<SignUp>` 컴포넌트에 CanvasHub 다크 테마 `appearance`를 적용했다.

---

# 2. Clerk 전역 설정

## 패키지

```bash
npm install @clerk/nextjs
```

## 환경 변수 (`.env.local`)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

> Clerk Keyless Mode: env 없이도 dev 서버 기동 시 임시 키가 생성될 수 있다.
> 프로덕션/팀 협업 시 [Clerk Dashboard](https://dashboard.clerk.com/)에서
> 키를 발급한다.

## proxy.ts

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/create(.*)",
  "/gallery(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};
```

## app/layout.tsx

```typescript
import { ClerkProvider } from "@clerk/nextjs";

<ClerkProvider signInUrl="/login" signUpUrl="/register">
  {children}
</ClerkProvider>
```

> `ClerkProvider`는 `<body>` 내부에 배치한다.

---

# 3. 로그인 페이지 명세

## 페이지 경로

```bash
/login
```

---

## 페이지 목적

* Clerk 기반 사용자 인증
* 세션 생성 (Clerk Session)
* 메인 피드(`/`) 진입

---

# 4. 로그인 화면 레이아웃

## 전체 구조

```text
┌────────────────────────────┐
│        CanvasHub           │  ← LoginHeader
│   Create. Share. Inspire.  │
│   ┌──────────────────┐     │
│   │ Clerk SignIn UI  │     │  ← LoginForm (<SignIn />)
│   │ (이메일/소셜 등)   │     │
│   │ 회원가입 링크     │     │
│   └──────────────────┘     │
└────────────────────────────┘
```

---

# 5. LoginBackground 명세

## 파일 위치

```bash
app/login/LoginBackground.tsx
```

---

## 목적

서비스 브랜드 분위기 제공

---

## 디자인 규칙

| 항목         | 값              |
| ---------- | -------------- |
| Background | `#0F1115`      |
| Surface    | `#1A1D24`      |
| Border     | `#2A2F3A`      |
| Gradient   | Dark Purple 계열 |
| Layout     | 화면 중앙 정렬       |

---

## UX 규칙

* 과한 애니메이션 금지
* 로그인 집중도 유지
* 콘텐츠 중심 레이아웃

---

# 6. LoginHeader 명세

## 파일 위치

```bash
app/login/LoginHeader.tsx
```

---

## 구성 요소

| 요소          | 설명           |
| ----------- | ------------ |
| Logo        | CanvasHub 로고 |
| Description | 서비스 소개 문구    |

---

## 표시 문구 예시

```text
Create. Share. Inspire.
```

---

# 7. LoginForm 명세 (Clerk)

## 파일 위치

```bash
app/login/LoginForm.tsx
```

---

## 목적

Clerk `<SignIn />` 컴포넌트로 로그인 UI 제공

---

## Clerk 설정

| prop               | 값           |
| ------------------ | ----------- |
| `routing`          | `"path"`    |
| `path`             | `"/login"`  |
| `signUpUrl`        | `"/register"` |
| `forceRedirectUrl` | `"/"`       |

---

## 사용 컴포넌트

| 컴포넌트   | 패키지           |
| ------ | ------------- |
| SignIn | @clerk/nextjs |

---

## Appearance (CanvasHub 다크 테마)

* Primary: `hsl(252 100% 68%)`
* Background/Surface: Design Guide 색상과 동일
* Input/Button 높이: 48px (`h-12`)
* Border Radius: 12px

---

# 8. RegisterForm 명세 (Clerk)

## 파일 위치

```bash
app/register/RegisterForm.tsx
```

---

## Clerk 설정

| prop               | 값           |
| ------------------ | ----------- |
| `routing`          | `"path"`    |
| `path`             | `"/register"` |
| `signInUrl`        | `"/login"`  |
| `forceRedirectUrl` | `"/"`       |

---

## 사용 컴포넌트

| 컴포넌트   | 패키지           |
| ------ | ------------- |
| SignUp | @clerk/nextjs |

---

# 9. 공통 Header 인증 UI

## 파일 위치

```bash
components/layout/header.tsx
```

---

## signed-out

| 요소           | Clerk 컴포넌트    |
| ------------ | ------------- |
| 로그인          | SignInButton  |
| 회원가입         | SignUpButton  |

```tsx
<Show when="signed-out">
  <SignInButton mode="redirect" forceRedirectUrl="/">...</SignInButton>
  <SignUpButton mode="redirect" forceRedirectUrl="/">...</SignUpButton>
</Show>
```

---

## signed-in

| 요소     | Clerk 컴포넌트              |
| ------ | ----------------------- |
| 프로필 메뉴 | UserButton              |
| 로그아웃   | SignOutButton           |

```tsx
<Show when="signed-in">
  {/* 내 갤러리 · 프로필 · 이미지 생성 nav */}
  <UserButton />
  <SignOutButton signOutOptions={{ redirectUrl: "/login" }}>...</SignOutButton>
</Show>
```

> `<Show>` 사용 (`<SignedIn>` / `<SignedOut>` deprecated)

---

# 10. 사용자 인터랙션

## 로그인 흐름

```text
/login 진입
→ Clerk SignIn UI (이메일·소셜 등)
→ Clerk 세션 생성
→ / (메인 피드) 리다이렉트
```

---

## 회원가입 흐름

```text
/register 진입 (또는 SignIn 하단 링크)
→ Clerk SignUp UI
→ Clerk 세션 생성
→ / 리다이렉트
```

---

## 로그아웃 흐름

```text
Header 로그아웃 클릭
→ Clerk SignOut
→ /login 이동
```

---

# 11. 보호 라우트

| 경로       | 인증        | 미인증 시            |
| -------- | --------- | ---------------- |
| /create  | Clerk 필수  | Clerk → /login   |
| /gallery | Clerk 필수  | Clerk → /login   |
| /profile | Clerk 필수  | Clerk → /login   |
| /        | 공개        | —                |

> `clerkMiddleware` + `createRouteMatcher` + `auth.protect()`로 처리한다.

---

# 12. API Route 인증 (Clerk)

## 파일 위치

```bash
lib/auth/get-request-user-id.ts
```

---

## 구현

```typescript
import { auth } from "@clerk/nextjs/server";

export async function getRequestUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}
```

> `/api/generate` 등 보호 API에서 `await getRequestUserId()`로 Clerk
> `userId`를 조회한다.

---

# 13. 접근성(A11y)

| 항목                  | 적용                          |
| ------------------- | --------------------------- |
| Clerk 기본 a11y       | SignIn/SignUp/UserButton 내장 |
| keyboard navigation | Clerk + Header nav 지원       |
| aria-label          | Header nav/버튼 제공            |

---

# 14. (Deprecated) 목업 Auth API

> **Clerk 연동 이후 아래 API는 사용하지 않는다.** 참고용으로만 남긴다.

| Endpoint              | 이전 용도        |
| --------------------- | ------------ |
| POST /api/auth/login  | 목업 로그인       |
| POST /api/auth/register | 목업 회원가입   |
| POST /api/auth/logout | 목업 로그아웃      |
| GET /api/auth/session | 목업 세션 조회   |

---

# 15. Frontend 테스트 항목

## Clerk UI

* `/login` SignIn 렌더링
* `/register` SignUp 렌더링
* 회원가입 후 Header `UserButton` 노출
* 로그아웃 후 `/login` 이동

## 보호 라우트

* 미로그인 `/gallery` → `/login` 리다이렉트
* 로그인 후 `/create` 접근 가능

## API

* 미인증 POST `/api/generate` → 401
* 인증 후 생성 job 정상 생성

---

# 16. 참고 문서

* Clerk Next.js Quickstart: https://clerk.com/docs/nextjs/getting-started/quickstart
* Components: https://clerk.com/docs/reference/components/overview
* Dashboard: https://dashboard.clerk.com/
* Design Guide `5-0. 공통 헤더`, `5-1. 로그인 화면`
