# 공통 헤더 Frontend 기능명세서

> Design Guide `5-0. 공통 헤더 (Header)` 기준 명세다.
>
> 구현 상태: **프론트엔드 구현 완료**. `components/layout/header.tsx`에 공통
> Header 컴포넌트가 구현됐으며, 기존 `app/FeedHeader.tsx`는 하위 호환을 위해
> `Header`를 re-export한다. 메인 피드·갤러리·생성·프로필 화면에서 공통으로
> 사용한다. 컨벤션은 `Main Page.md`·`Gallery.md`·`Profile.md`와 동일하다.

---

# 프론트엔드 기능명세서

---

# 1. 컴포넌트 구조

## 파일 위치

```bash
components/
 └── layout/
     └── header.tsx          # 공통 Header (export: Header)

app/
 └── FeedHeader.tsx          # Header re-export (하위 호환 alias)
```

> 구현 반영: `.cursorrules`의 공통 레이아웃 컴포넌트 경로(`components/layout/`)
> 에 Header를 배치했다. 기존 페이지는 `FeedHeader` import를 유지해도 동일
> 컴포넌트가 렌더링된다.

---

## import 방식

```tsx
// 권장 (신규 코드)
import { Header } from "@/components/layout/header";

// 하위 호환 (기존 페이지)
import { FeedHeader } from "@/app/FeedHeader";
```

---

# 2. 컴포넌트 역할

## 목적

* 주요 화면 간 일관된 전역 내비게이션 제공
* 홈(피드)·내 갤러리·이미지 생성으로 빠른 이동
* Creation First 원칙에 따라 **이미지 생성**을 Primary CTA로 강조

---

## 사용 화면

| 화면       | 경로        | import 위치                          |
| -------- | --------- | ---------------------------------- |
| 메인 피드    | `/`       | `app/FeedPageClient.tsx`           |
| 내 갤러리    | `/gallery` | `app/gallery/GalleryClient.tsx`    |
| 이미지 생성   | `/create`  | `app/create/page.tsx`              |
| 프로필      | `/profile` | `app/profile/ProfileClient.tsx`    |

> 로그인·회원가입·이미지 상세 등은 화면별 전용 헤더(`LoginHeader`,
> `ImageDetailHeader` 등)를 사용하며, 본 공통 Header는 포함하지 않는다.

---

# 3. 레이아웃 구조

## 전체 화면 구성

```text
┌──────────────────────────────────────────────────────────┐
│ [✨ CanvasHub]                    [내 갤러리] [이미지 생성] │
└──────────────────────────────────────────────────────────┘
```

## 레이아웃 규칙 (Desktop 전용)

```text
좌측: 로고 (Link → /)
우측: 내 갤러리 + 이미지 생성 (nav)
Header 높이: 64px (h-16)
최대 너비: 1600px (max-w-[1600px])
좌우 패딩: 24px (px-6)
정렬: justify-between
```

> 구현 반영: 모바일 버전은 개발하지 않기로 하여 Mobile 반응형 규칙은
> 제거했다. Header는 데스크탑 기준 단일 레이아웃으로 동작한다.

---

# 4. Header 명세

## 파일 위치

```bash
components/layout/header.tsx
```

---

## 구성 요소

| 요소       | 설명                              | 이동 경로     | UI 타입            |
| -------- | ------------------------------- | --------- | ---------------- |
| Logo     | Sparkles 아이콘 + CanvasHub 텍스트   | `/`       | Link             |
| 내 갤러리   | 저장 작품 관리 화면 이동                  | `/gallery` | Button (Ghost)   |
| 이미지 생성  | AI 이미지 생성 화면 이동 (Primary CTA) | `/create`  | Button (Primary) |

> 구현 반영: 이전 `FeedHeader`에 있던 검색·알림·프로필 드롭다운은 제거하고,
> 핵심 내비게이션(로고·내 갤러리·이미지 생성)만 노출한다.

---

## 사용 컴포넌트

| 컴포넌트   | 타입              | 용도              |
| ------ | --------------- | --------------- |
| Link   | Next.js         | 로고·메뉴 라우팅       |
| Button | ShadCN          | 내 갤러리·이미지 생성 버튼 |
| Icons  | lucide-react    | Sparkles, Images |

---

## 내비게이션 데이터

```ts
const NAV_ITEMS = [
  {
    href: "/gallery",
    label: "내 갤러리",
    icon: Images,
    match: (pathname: string) => pathname.startsWith("/gallery"),
  },
  {
    href: "/create",
    label: "이미지 생성",
    icon: Sparkles,
    match: (pathname: string) => pathname.startsWith("/create"),
  },
] as const;
```

> `usePathname()`으로 현재 경로를 판별해 활성 메뉴 스타일과
> `aria-current="page"`를 적용한다.

---

## 스타일 명세

| 영역       | 클래스 / 값                                              |
| -------- | ---------------------------------------------------- |
| Header   | `sticky top-0 z-40 border-b border-border/60`        |
| 배경       | `bg-background/80 backdrop-blur-md`                  |
| 진입 애니메이션 | `animate-in fade-in slide-in-from-top-2 duration-300` |
| 로고 아이콘   | `h-8 w-8 rounded-lg bg-primary`                      |
| 내 갤러리    | Ghost Button, 활성 시 `bg-accent text-accent-foreground` |
| 이미지 생성   | Primary Button (`variant="default"`)                 |

---

## 상태 규칙

| 메뉴      | 조건                          | 스타일                         |
| ------- | --------------------------- | --------------------------- |
| 내 갤러리   | `pathname.startsWith("/gallery")` | Ghost + Accent 배경           |
| 이미지 생성  | `pathname.startsWith("/create")`  | Primary (항상 CTA 강조)         |
| 로고      | —                           | Hover 시 `opacity-80`         |

> 이미지 생성은 Primary CTA이므로 활성 여부와 관계없이 Primary 스타일을
> 유지한다. 내 갤러리만 Ghost + 활성 강조 패턴을 사용한다.

---

# 5. FeedHeader (Re-export) 명세

## 파일 위치

```bash
app/FeedHeader.tsx
```

## 목적

기존 페이지 import 경로(`@/app/FeedHeader`) 하위 호환 유지

## 구현

```tsx
export { Header as FeedHeader } from "@/components/layout/header";
```

> 신규 개발 시 `@/components/layout/header`의 `Header`를 직접 import하는
> 것을 권장한다. `FeedHeader`는 점진적 마이그레이션을 위한 alias다.

---

# 6. 인터랙션

| 액션          | 결과                         |
| ----------- | -------------------------- |
| 로고 클릭       | `/` (메인 피드) 이동            |
| 내 갤러리 클릭    | `/gallery` 이동              |
| 이미지 생성 클릭   | `/create` 이동               |
| Tab 키       | 로고 → 내 갤러리 → 이미지 생성 순 포커스 |
| Enter / Space | 포커스된 링크 이동                 |

---

# 7. 사용자 흐름

## 공통 내비게이션 흐름

```text
임의 화면 진입
→ Header 노출
→ [내 갤러리] 또는 [이미지 생성] 클릭
→ 해당 화면 이동
→ Header 활성 메뉴 갱신
```

## Creation First 흐름

```text
메인 피드 탐색
→ Header [이미지 생성] 클릭
→ /create 이동
→ 프롬프트 입력 및 생성
```

---

# 8. 애니메이션 명세

| 요소     | 효과        | 클래스                                      |
| ------ | --------- | ---------------------------------------- |
| Header | Fade Down | `animate-in fade-in slide-in-from-top-2` |
| 로고 Hover | Opacity   | `transition-opacity hover:opacity-80`    |
| 버튼 Hover | ShadCN 기본 | Button variant transition                |

---

# 9. 접근성(A11y)

| 항목                  | 내용                                      |
| ------------------- | --------------------------------------- |
| aria-label (로고)     | `"CanvasHub 홈"`                         |
| aria-label (nav)    | `"주요 메뉴"`                               |
| aria-current        | 현재 페이지 메뉴에 `"page"` 설정                 |
| aria-hidden (아이콘)   | 장식용 아이콘에 적용                             |
| keyboard navigation | Tab / Enter / Space 지원                  |
| focus visible       | ShadCN Button 기본 outline                 |
| 최소 터치/클릭 영역        | Button `size="sm"` (h-8 이상)             |

---

# 10. Frontend 테스트 항목

## UI 테스트

* Header가 sticky로 상단 고정되는지 확인
* 로고·내 갤러리·이미지 생성 3요소가 좌우 정렬되는지 확인
* `/gallery` 진입 시 **내 갤러리** Accent 활성 스타일 확인
* `/create` 진입 시 **이미지 생성** Primary 버튼 유지 확인
* `/`, `/profile` 진입 시 nav 활성 강조가 없거나 해당 없음 확인

## 인터랙션 테스트

* 로고 클릭 → `/` 이동
* 내 갤러리 클릭 → `/gallery` 이동
* 이미지 생성 클릭 → `/create` 이동
* 키보드 Tab 순서: 로고 → 내 갤러리 → 이미지 생성

## 회귀 테스트 (사용 화면)

* `FeedPageClient` Header 노출
* `GalleryClient` Header 노출
* `create/page` Header 노출
* `ProfileClient` Header 노출
* `FeedHeader` import 하위 호환 동작

---

# 11. 관련 문서

| 문서               | 관계                                      |
| ---------------- | --------------------------------------- |
| `Design Guide.md` | UX·레이아웃·접근성 원칙 (`5-0. 공통 헤더`)          |
| `Main Page.md`    | 메인 피드 상단 Header 사용                      |
| `Gallery.md`      | 갤러리 상단 Header 사용                        |
| `Image Create.md` | 생성 페이지 상단 Header 사용                     |
| `Profile.md`      | 프로필 상단 Header 사용                        |
| `Login.md`        | 로그인 전용 `LoginHeader` (공통 Header 미사용)   |
| `Image Detail.md` | 상세 전용 `ImageDetailHeader` (공통 Header 미사용) |

---

# 12. 변경 이력

| 버전  | 변경 내용                                              |
| --- | -------------------------------------------------- |
| v1  | `components/layout/header.tsx` 공통 Header 신규 구현     |
| v1  | 구성: 로고 · 내 갤러리 · 이미지 생성                           |
| v1  | `app/FeedHeader.tsx` → Header re-export (하위 호환)  |
| v1  | 검색·알림·프로필 드롭다운 제거 (핵심 내비게이션 단순화)                |
