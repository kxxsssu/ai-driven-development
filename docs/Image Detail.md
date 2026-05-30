# 이미지 상세 화면 기능명세서

> Design Guide `5-7. 이미지 상세 화면` 기준 명세다.
>
> 구현 상태: **프론트엔드 구현 완료 (백엔드 목업)**. `/images/[id]` 페이지와
> 하위 컴포넌트, 목업 Route Handler(`/api/images/[id]`)가 구현됐다. `FeedCard`·
> `GalleryCard`·`ProfileGrid`의 이미지 링크가 모두 이 페이지로 연결된다. 좋아요는
> 기존 `store/interaction-store.ts`(localStorage 영속)를 재사용한다. 실제 DB
> 연동은 추후 본 명세를 기준으로 교체한다.

---

# 프론트엔드 기능명세서

---

# 1. 페이지 구조

## 페이지 경로

```bash
/images/[id]
```

## 라우트 구조 (구현 반영)

```bash
app/
 └── images/
     └── [id]/
         ├── page.tsx              # 서버 컴포넌트 (params.id 전달)
         ├── ImageDetailClient.tsx # 클라이언트 조립 + 로딩/에러 분기
         ├── ImageDetailHeader.tsx # 뒤로가기 + 좋아요
         ├── ImageViewer.tsx       # 대형 이미지
         ├── ImageMetadata.tsx     # 작성자/Prompt/옵션
         └── ImageActions.tsx      # Copy Prompt / Generate Similar
```

> 구현 반영: `page.tsx`(서버)는 `params.id`만 클라이언트로 전달하고, 실제
> 데이터 조회는 `ImageDetailClient`가 TanStack Query(`hooks/use-image-detail.ts`)로
> 수행한다(메인 피드의 클라이언트 패칭 패턴과 통일).

---

# 2. 페이지 목적

* 작품 감상 (대형 이미지)
* 프롬프트 및 생성 옵션 탐색
* 좋아요 / 댓글 등 상호작용
* 프롬프트 재활용 → 재창작 연결

---

# 3. 레이아웃 구조

```text
┌─────────────────────────────┐
│ ← 뒤로가기        ♥ 1.2k    │  ← ImageDetailHeader
├─────────────────────────────┤
│                             │
│        [ 대형 이미지 ]       │  ← ImageViewer (Full Width)
│                             │
├─────────────────────────────┤
│ 작성자 Avatar  닉네임        │
│ Prompt: ...                 │  ← ImageMetadata
│ Style / Ratio / 생성일       │
├─────────────────────────────┤
│ [Copy Prompt] [Gen Similar] │  ← ImageActions
└─────────────────────────────┘
```

> 구현 반영: 데스크탑(lg↑)에서는 좌측 대형 이미지 / 우측 메타데이터·액션의
> 2단 그리드(`lg:grid-cols-[1.4fr_1fr]`)로 배치하고, 좁은 화면에서는 위 그림처럼
> 세로 1단으로 쌓인다. 상단 헤더(뒤로가기/좋아요)는 sticky로 고정된다.

---

# 4. ImageDetailHeader 명세

## 구성 요소

| 요소     | 설명                  |
| ------ | ------------------- |
| 뒤로가기   | `router.back()` 또는 `/` 이동 |
| 좋아요 버튼 | 좋아요 토글              |
| 좋아요 수  | 실시간 카운트             |

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Button | ShadCN |

> 좋아요 상태는 `interaction-store`의 `likedIds`/`toggleLike`를 재사용하며
> localStorage에 영속된다(메인 피드와 동일).

---

# 5. ImageViewer 명세

## 기능

* 대형 이미지 표시 (Full Width)
* 이미지 비율 유지
* Lazy Loading / next/image 최적화

## UX 규칙

| 항목     | 규칙              |
| ------ | --------------- |
| Width  | Full Width      |
| Height | 이미지 비율 유지       |
| Load   | Fade In         |

---

# 6. ImageMetadata 명세

## 표시 항목

| 항목      | 설명           |
| ------- | ------------ |
| 작성자     | Avatar + 닉네임 |
| Prompt  | 생성 프롬프트 텍스트  |
| Style   | 생성 스타일       |
| Ratio   | 이미지 비율       |
| 생성일     | 생성 날짜        |

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Avatar | ShadCN |
| Badge  | ShadCN |

---

# 7. ImageActions 명세

## 액션

| 액션               | 설명                        |
| ---------------- | ------------------------- |
| Copy Prompt      | Prompt 클립보드 복사 + Toast 안내 |
| Generate Similar | `/create`로 이동 + 설정 자동 주입  |

> 구현 반영: Copy Prompt는 `navigator.clipboard.writeText` + Toast로 구현했다.
> Generate Similar는 `generation-store`에 prompt·style·ratio를 사전 주입한 뒤
> `/create`로 이동해, 생성 화면이 해당 설정으로 채워진 상태로 열린다.

---

# 8. 사용자 흐름

## 상세 진입 → 재창작

```text
FeedCard / GalleryCard 클릭
→ /images/[id] 진입
→ 이미지 감상 + 메타데이터 확인
→ Copy Prompt 또는 Generate Similar
→ /create 재창작 흐름 연결
```

---

# 9. 상태 관리

```ts
// 서버 상태 (이미지 상세)
imageDetail = {
  image,        // IImageDetail (서버 조회)
}

// 좋아요/댓글 (Zustand persist, localStorage 재사용)
interactionState = {
  likedIds,
  comments
}
```

## 권장 라이브러리 (구현 반영)

| 목적         | 라이브러리                                |
| ---------- | ------------------------------------ |
| 이미지 상세 조회  | TanStack Query (`hooks/use-image-detail.ts`) |
| 좋아요 영속     | Zustand persist (`store/interaction-store.ts`) |

> 구현 반영: 댓글은 상세 화면에 노출하지 않았다(메인 피드 카드의 `CommentDialog`에서
> 처리). 상세 화면은 좋아요 + 프롬프트 재활용에 집중한다.

---

# 10. 접근성(A11y)

| 항목          | 적용                |
| ----------- | ----------------- |
| alt text    | 이미지 설명 제공         |
| aria-label  | 뒤로가기/좋아요/복사 버튼 라벨 |
| keyboard    | 포커스 이동 및 Enter 동작 |
| 상태 전달       | 좋아요 색상 + aria-pressed |

---

# 11. 프론트엔드 테스트 항목

* 이미지/메타데이터 정상 렌더링 여부
* 좋아요 토글 + 카운트 반영 여부
* Copy Prompt 복사 + Toast 여부
* Generate Similar 이동 + 설정 주입 여부
* 잘못된 id 접근 시 404 처리 여부

---

# 백엔드 기능명세서

> 구현 상태: **목업 구현**. `app/api/images/[id]/route.ts`가 중앙 목업
> 소스(`lib/mock/images-data.ts`)에서 id로 이미지를 조회해 `IImageDetail`을
> 반환하고, 없으면 404를 반환한다. 비공개 이미지 권한 검증·좋아요 API·DB(Drizzle)
> 연동은 미구현이며, 실제 연동 시 본 명세를 기준으로 교체한다.

---

# 1. 이미지 상세 조회 API

## 요청

```http
GET /api/images/{id}
```

## 응답 구조

```ts
interface IImageDetail {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  ratio: string;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}
```

---

# 2. 조회 조건

| 조건         | 설명                              |
| ---------- | ------------------------------- |
| 공개 이미지     | 누구나 조회 가능 (isPublic = true)     |
| 비공개 이미지    | 본인만 조회 (userId = session.userId) |
| 삭제 데이터 제외  | deletedAt IS NULL               |

---

# 3. 좋아요 API (연동 시)

## 요청

```http
POST /api/images/{id}/like     # 좋아요
DELETE /api/images/{id}/like   # 좋아요 취소
```

> 현재 좋아요는 클라이언트 localStorage 목업이며, 서버 연동 시 위 API로
> 교체한다.

---

# 4. DB 설계 (images / users 재사용)

| 컬럼         | 타입        |
| ---------- | --------- |
| id         | uuid      |
| userId     | uuid      |
| imageUrl   | text      |
| prompt     | text      |
| style      | varchar   |
| ratio      | varchar   |
| likesCount | integer   |
| isPublic   | boolean   |
| createdAt  | timestamp |

---

# 5. 에러 처리

| 상황            | 처리   |
| ------------- | ---- |
| 잘못된 id        | 404  |
| 비공개 이미지 무권한 접근 | 403  |
| 서버 오류         | 500  |

---

# 6. 백엔드 테스트 항목

* 공개 이미지 상세 조회 여부
* 비공개 이미지 본인 외 접근 차단 여부
* 작성자 Join 정상 반환 여부
* 잘못된 id 접근 404 처리 여부
