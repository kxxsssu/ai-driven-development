# 개인 갤러리 화면 기능명세서

> Design Guide `5-6. 개인 갤러리 화면` 기준 명세다.
>
> 공통 Header 명세는 `Header.md`를 참고한다.
>
> 구현 상태: **프론트엔드 구현 완료 (백엔드 목업)**. `/gallery` 페이지와 하위
> 컴포넌트, 목업 Route Handler(`/api/gallery`)가 구현됐다. 데이터는 중앙
> 목업 소스(`lib/mock/images-data.ts`)에서 현재 사용자(`CURRENT_USER`)의
> 작품을 제공하며, 실제 DB/인증 연동은 추후 본 명세를 기준으로 교체한다.
> 컨벤션은 메인 피드(`Main Page.md`)·생성 결과(`Generation Result.md`)를 따른다.

---

# 프론트엔드 기능명세서

---

# 1. 페이지 구조

## 페이지 경로

```bash
/gallery
```

## 라우트 구조 (구현 반영)

```bash
app/
 └── gallery/
     ├── page.tsx            # 서버 컴포넌트 (보호 라우트, metadata)
     ├── GalleryClient.tsx   # 클라이언트 조립
     ├── GalleryTabs.tsx     # 전체/공개/비공개 탭
     ├── GallerySort.tsx     # 정렬 (최신/오래된순)
     ├── GalleryGrid.tsx     # 반응형 Grid + 무한 스크롤 + 탭 필터
     ├── GalleryCard.tsx     # 갤러리 이미지 카드 + 공개 토글
     └── GalleryEmpty.tsx    # 빈 상태 (탭별 메시지)
```

> 구현 반영: 명세 구조와 동일하게 구현했다. `page.tsx`는 서버 컴포넌트로
> metadata만 정의하고 화면 조립은 `GalleryClient.tsx`가 담당한다.

---

# 2. 페이지 목적

* 생성/저장한 이미지 관리
* 공개/비공개 상태 전환
* 이미지 상세 진입

---

# 3. 레이아웃 구조

```text
┌─────────────────────────────┐
│ Header (공통)                │
├─────────────────────────────┤
│ GalleryTabs   GallerySort   │
├─────────────────────────────┤
│ GalleryGrid                 │
│  └─ GalleryCard 🌍          │
│  └─ GalleryCard 🔒          │
│  └─ GalleryCard 🌍          │
└─────────────────────────────┘
```

> 데스크탑 전용 레이아웃으로 구현한다(모바일 미지원, 메인 피드와 동일 정책).

---

# 4. GalleryTabs 명세

## 탭 구성

| 탭   | 필터 조건            |
| --- | ---------------- |
| 전체  | 모든 이미지           |
| 공개  | visibility = public  |
| 비공개 | visibility = private |

## 사용 컴포넌트

| 컴포넌트        | 타입     |
| ----------- | ------ |
| Tabs        | ShadCN |
| TabsList    | ShadCN |
| TabsTrigger | ShadCN |

## 상태 관리

```ts
type GalleryTab = "all" | "public" | "private"
```

---

# 5. GallerySort 명세

## 정렬 옵션

| 옵션    | 정렬 기준        |
| ----- | ------------ |
| 최신순   | createdAt DESC |
| 오래된순  | createdAt ASC  |

## 사용 컴포넌트

* ShadCN `Select`

## 상태 관리

```ts
type GallerySort = "latest" | "oldest"
```

---

# 6. GalleryGrid 명세

## 주요 기능

* 반응형 이미지 Grid
* Infinite Scroll (IntersectionObserver)
* Lazy Loading
* Skeleton Loading

## Grid 규칙 (Desktop 전용)

| 화면 크기   | 컬럼 수 |
| ------- | ---- |
| ≥1440px | 6    |
| ≥1024px | 4    |
| 기본      | 3    |

> 메인 피드와 동일한 Masonry/Grid 규칙을 재사용한다.

---

# 7. GalleryCard 명세

## 카드 구성

| 요소         | 설명                       |
| ---------- | ------------------------ |
| 이미지 썸네일    | 클릭 시 `/images/[id]` 이동   |
| 공개 상태 Badge | 🌍 Public / 🔒 Private   |
| 공개 토글      | 공개/비공개 즉시 전환             |
| 생성 정보      | 스타일 / 비율 / 생성일           |

## 사용 컴포넌트

| 컴포넌트         | 타입     |
| ------------ | ------ |
| Badge        | ShadCN |
| 공개 토글        | 커스텀 토글 버튼 (`role="switch"`) |
| Image        | next/image |

> 구현 반영: `Switch` 컴포넌트(@radix-ui/react-switch)는 미설치 상태라
> 의존성 추가 없이 `role="switch"` + `aria-checked` 접근성 토글 버튼으로
> 구현했다. 카드 컨테이너는 ShadCN `Card` 대신 Masonry용 div(`break-inside-avoid`)를
> 사용하며, 더보기(DropdownMenu)는 두지 않고 토글만 노출했다.

---

# 8. 공개 상태 전환 UX

| 상태       | 표시            |
| -------- | ------------- |
| Public   | 🌍 Public Badge |
| Private  | 🔒 Private Badge |
| 전환 중     | 낙관적 업데이트 + 실패 시 롤백 |

> 구현 반영: 토글 시 즉시 UI에 반영(낙관적 업데이트)하고 Toast로 안내한다.
> 토글 결과는 `store/gallery-store.ts`의 `visibilityOverrides`에 저장되어
> localStorage(`canvashub-gallery`)에 영속되며, 새로고침·재방문에도 유지된다.
> 탭(전체/공개/비공개) 필터는 override를 병합한 결과를 클라이언트에서 적용해
> 토글 즉시 탭 간 이동이 반영된다. 실제 API 연동 시 실패하면 롤백한다(목업
> 단계에서는 항상 성공으로 처리).

---

# 9. 빈 상태(GalleryEmpty)

| 요소     | 내용                  |
| ------ | ------------------- |
| 일러스트   | 빈 갤러리 이미지           |
| 안내 문구  | 아직 저장한 이미지가 없어요     |
| 생성 버튼  | `/create` 이동        |

---

# 10. 상태 관리

```ts
// 서버 상태 (TanStack Query, useInfiniteQuery)
items, hasNextPage, isFetchingNextPage

// UI/영속 상태 (Zustand, store/gallery-store.ts)
galleryState = {
  activeTab,            // "all" | "public" | "private"
  sort,                 // "latest" | "oldest"
  visibilityOverrides,  // Record<imageId, "public" | "private"> (persist)
}
```

## 권장 라이브러리 (구현 반영)

| 목적          | 라이브러리                                |
| ----------- | ------------------------------------ |
| 서버 상태(갤러리)  | TanStack Query (`hooks/use-gallery.ts`) |
| 탭/정렬 UI     | Zustand (`store/gallery-store.ts`)      |
| 공개 토글 영속    | Zustand persist (`partialize`로 overrides만 저장) |

---

# 11. 접근성(A11y)

| 항목          | 적용             |
| ----------- | -------------- |
| aria-label  | 공개 토글/카드 버튼 제공 |
| keyboard    | 탭/정렬 키보드 탐색    |
| alt text    | 이미지 설명 제공      |
| 상태 전달       | Badge 텍스트 병행   |

---

# 12. 프론트엔드 테스트 항목

* 탭 필터(전체/공개/비공개) 동작 여부
* 정렬(최신/오래된) 전환 여부
* 공개 토글 낙관적 업데이트 + 롤백 여부
* Infinite Scroll 동작 여부
* 빈 상태 표시 여부

---

# 백엔드 기능명세서

> 구현 상태: **목업 구현**. `app/api/gallery/route.ts`가 DB 대신 중앙 목업
> 소스(`lib/mock/images-data.ts`)의 현재 사용자 작품을 정렬·cursor
> 페이지네이션하여 반환한다. 페이지네이션은 제네릭 헬퍼(`lib/mock/pagination.ts`)를
> 피드와 공유한다. 공개 전환 API(`PATCH`)와 DB(Drizzle) 연동은 미구현이며,
> 현재 공개 토글은 클라이언트(`gallery-store`)에서 처리한다.

---

# 1. 갤러리 조회 API

## 요청

```http
GET /api/gallery
```

## Query Parameters

| 이름     | 타입     | 설명                       |
| ------ | ------ | ------------------------ |
| sort   | string | latest / oldest          |
| cursor | string | pagination cursor        |
| limit  | number | 기본 20 (최대 50)            |

> 구현 반영: 탭(전체/공개/비공개) 필터는 서버 `filter` 파라미터 대신
> 클라이언트에서 적용한다(공개 토글 낙관적 업데이트와 일관성 유지). 따라서
> 목업 API는 내 작품 전체를 `sort` 기준으로 정렬해 반환한다.

## 응답 구조

```ts
{
  items: IGalleryItem[],
  nextCursor: string | null,
  hasNextPage: boolean
}
```

---

# 2. 공개 상태 전환 API

## 요청

```http
PATCH /api/gallery/{imageId}/visibility
```

## Request Body

```json
{ "visibility": "public" }
```

## 기능

* 본인 소유 이미지 visibility 변경
* 공개 전환 시 메인 피드 노출 대상 포함

---

# 3. 조회 조건

| 조건         | 설명                     |
| ---------- | ---------------------- |
| 본인 이미지만 조회 | userId = session.userId |
| 삭제 데이터 제외  | deletedAt IS NULL      |
| filter 적용  | visibility 조건 필터링      |

---

# 4. DB 설계 (images 테이블 재사용)

| 컬럼         | 타입        |
| ---------- | --------- |
| id         | uuid      |
| userId     | uuid      |
| prompt     | text      |
| style      | varchar   |
| ratio      | varchar   |
| imageUrl   | text      |
| visibility | varchar   |
| createdAt  | timestamp |

---

# 5. 보안 / 에러 처리

| 상황          | 처리                  |
| ----------- | ------------------- |
| 비로그인 접근     | `/login` redirect (middleware) |
| 타인 이미지 수정   | 403 Forbidden       |
| 잘못된 imageId | 404                 |
| 서버 오류       | 500 + Toast         |

---

# 6. 백엔드 테스트 항목

* 본인 이미지만 조회되는지 여부
* 필터/정렬 정상 동작 여부
* 공개 전환 후 메인 피드 반영 여부
* 타인 이미지 수정 차단 여부
