# 프로필 화면 기능명세서

> Design Guide `5-8. 프로필 화면` 기준 명세다.
>
> 구현 상태: **프론트엔드 구현 완료 (백엔드 목업)**. `/profile` 페이지와 하위
> 컴포넌트, 목업 Route Handler(`/api/profile/[id]`, `/api/profile/[id]/images`)가
> 구현됐다. `/profile`은 현재 사용자(`CURRENT_USER`)를 의미하며, 사용자 정보/
> 통계와 공개 작품을 제공한다. 실제 DB 연동은 추후 본 명세를 기준으로 교체한다.

---

# 프론트엔드 기능명세서

---

# 1. 페이지 구조

## 페이지 경로

```bash
/profile          # 내 프로필
/profile/[id]     # 특정 크리에이터 프로필 (확장)
```

## 라우트 구조 (구현 반영)

```bash
app/
 └── profile/
     ├── page.tsx            # 내 프로필 (서버 컴포넌트, id="me" 전달)
     ├── ProfileClient.tsx   # 클라이언트 조립 + 로딩/에러 분기
     ├── ProfileHeader.tsx   # 프로필 정보 + 통계
     ├── ProfileGrid.tsx     # 공개 작품 Grid + 무한 스크롤
     └── ProfileEmpty.tsx    # 빈 상태
```

> 구현 반영: `page.tsx`(서버)는 `id="me"`만 전달하고, 사용자 정보와 작품
> 목록은 `ProfileClient`가 TanStack Query(`hooks/use-profile.ts`)로 조회한다.
> `/profile/[id]`(타인 프로필)는 API/데이터는 준비됐으나 별도 라우트 페이지는
> 아직 추가하지 않았다(확장 시 `id`만 다르게 전달하면 동작).

---

# 2. 페이지 목적

* 크리에이터 공개 작품 관리/노출
* 사용자 정보(닉네임/소개/통계) 표시
* 공개 작품 탐색 → 이미지 상세 진입

---

# 3. 레이아웃 구조

```text
┌─────────────────────────────┐
│ FeedHeader (공통)            │
├─────────────────────────────┤
│      ◯ 프로필 이미지         │
│        닉네임               │  ← ProfileHeader
│        소개 문구            │
│   업로드 12  ♥ 1.2k         │
├─────────────────────────────┤
│ ProfileGrid (공개 작품)      │
│  └─ Card  └─ Card  └─ Card  │
└─────────────────────────────┘
```

> 데스크탑 전용 레이아웃으로 구현한다(모바일 미지원).

---

# 4. ProfileHeader 명세

## 구성 요소

| 요소      | 설명           |
| ------- | ------------ |
| 프로필 이미지 | Avatar       |
| 닉네임     | 사용자 이름       |
| 소개      | 자기소개 문구      |
| 업로드 수   | 공개 작품 개수     |
| 좋아요 수   | 받은 좋아요 합계    |

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Avatar | ShadCN |

> 구현 반영: 프로필 편집/팔로우 버튼은 PRD상 확장 기능(P2 이후)이라 MVP에서는
> 노출하지 않았다. 현재는 아바타·닉네임·소개·통계(업로드/좋아요)만 표시한다.

---

# 5. ProfileGrid 명세

## 주요 기능

* 공개 작품 Grid 표시
* Infinite Scroll
* Lazy Loading
* 카드 클릭 시 `/images/[id]` 이동

## Grid 규칙 (Desktop 전용)

| 화면 크기   | 컬럼 수 |
| ------- | ---- |
| ≥1440px | 6    |
| ≥1024px | 4    |
| 기본      | 3    |

> 메인 피드/갤러리와 동일한 Grid 규칙을 재사용한다. 단, 공개 작품
> (isPublic = true)만 노출한다.

---

# 6. ProfileEmpty 명세

| 요소     | 내용               |
| ------ | ---------------- |
| 일러스트   | 빈 상태 이미지         |
| 안내 문구  | 아직 공개한 작품이 없어요   |
| 생성 버튼  | 본인일 때 `/create` 이동 |

---

# 7. 상태 관리

```ts
profileState = {
  user,         // IProfileUser
  items,        // 공개 작품 페이지 데이터
  hasNextPage
}
```

## 권장 라이브러리 (구현 반영)

| 목적       | 라이브러리                                  |
| -------- | -------------------------------------- |
| 프로필 조회   | TanStack Query (`useProfile`)          |
| 작품 목록    | TanStack Query (`useProfileImages`, useInfiniteQuery) |

> 구현 반영: 두 훅 모두 `hooks/use-profile.ts`에 정의했고, 작품 카드의 컬럼
> 규칙·무한 스크롤은 메인 피드/갤러리와 동일하게 재사용했다.

---

# 8. 접근성(A11y)

| 항목         | 적용             |
| ---------- | -------------- |
| alt text   | 프로필/작품 이미지 설명  |
| aria-label | 버튼 라벨 제공       |
| keyboard   | Grid/버튼 키보드 탐색 |

---

# 9. 프론트엔드 테스트 항목

* 프로필 정보/통계 정상 표시 여부
* 공개 작품만 노출되는지 여부
* Infinite Scroll 동작 여부
* 카드 클릭 → 상세 이동 여부
* 빈 상태 표시 여부

---

# 백엔드 기능명세서

> 구현 상태: **목업 구현**. `app/api/profile/[id]/route.ts`가 사용자 정보+
> 집계(업로드/좋아요 수)를, `app/api/profile/[id]/images/route.ts`가 공개 작품
> 목록(cursor 페이지네이션)을 반환한다. `id="me"`는 현재 사용자로 해석한다.
> 데이터는 중앙 목업 소스(`lib/mock/images-data.ts`)에서 계산하며, DB(Drizzle)
> 연동은 미구현이다. 본 명세를 기준으로 추후 교체한다.

---

# 1. 프로필 조회 API

## 요청

```http
GET /api/profile/{id}      # 특정 사용자
GET /api/profile/me        # 내 프로필
```

## 응답 구조

```ts
interface IProfileUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  uploadCount: number;   // 공개 작품 수
  likeCount: number;     // 받은 좋아요 합계
}
```

---

# 2. 공개 작품 목록 API

## 요청

```http
GET /api/profile/{id}/images
```

## Query Parameters

| 이름     | 타입     | 설명                |
| ------ | ------ | ----------------- |
| cursor | string | pagination cursor |
| limit  | number | 기본 20             |

## 조회 조건

| 조건        | 설명                |
| --------- | ----------------- |
| 공개 작품만 조회 | isPublic = true   |
| 삭제 데이터 제외 | deletedAt IS NULL |
| 정렬        | createdAt DESC    |

---

# 3. DB 설계

## users 테이블 (확장)

| 컬럼        | 타입            |
| --------- | ------------- |
| id        | uuid          |
| name      | text          |
| avatarUrl | text nullable |
| bio       | text nullable |
| createdAt | timestamp     |

## 집계 값

| 값           | 산출                                 |
| ----------- | ---------------------------------- |
| uploadCount | count(images WHERE isPublic=true)  |
| likeCount   | sum(images.likesCount)             |

---

# 4. 에러 처리

| 상황       | 처리   |
| -------- | ---- |
| 잘못된 id   | 404  |
| 미인증 (me) | `/login` redirect |
| 서버 오류    | 500  |

---

# 5. 백엔드 테스트 항목

* 프로필 정보/통계 정상 반환 여부
* 공개 작품만 조회되는지 여부
* 집계 값(업로드/좋아요 수) 정확성 여부
* 잘못된 id 접근 404 처리 여부
