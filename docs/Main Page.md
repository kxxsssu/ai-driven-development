# 메인페이지 Frontend 기능명세서

# 1. 페이지 구조

## 라우트 구조

```bash id="gwc7v0"
app/
 ├── page.tsx
 ├── loading.tsx
 ├── error.tsx
 ├── FeedHeader.tsx
 ├── FeedTabs.tsx
 ├── FeedGrid.tsx
 ├── FeedCard.tsx
 ├── FeedSkeleton.tsx
 ├── FeedEmpty.tsx
 └── MobileBottomNav.tsx
```

---

# 2. 페이지 역할

## 페이지 경로

```bash id="qg5u6s"
/
```

---

## 페이지 목적

* 공개 이미지 탐색
* 커뮤니티 콘텐츠 소비
* 이미지 상세 진입
* 생성 페이지 진입 유도
* 인기/최신 피드 탐색

---

# 3. 레이아웃 구조

## 전체 화면 구성

```text id="pv9i4d"
┌─────────────────────┐
│ FeedHeader          │
├─────────────────────┤
│ FeedTabs            │
├─────────────────────┤
│ FeedGrid            │
│  └─ FeedCard        │
│  └─ FeedCard        │
│  └─ FeedCard        │
├─────────────────────┤
│ MobileBottomNav     │
└─────────────────────┘
```

---

# 4. FeedHeader 명세

## 파일 위치

```bash id="h7x4i4"
app/FeedHeader.tsx
```

---

## 목적

전역 탐색 및 사용자 액션 제공

---

## 구성 요소

| 요소                  | 설명           |
| ------------------- | ------------ |
| Logo                | CanvasHub 로고 |
| Search Input        | 이미지/유저 검색    |
| Notification Button | 알림 이동        |
| Profile Button      | 프로필 이동       |

---

## 사용 컴포넌트

| 컴포넌트         | 타입     |
| ------------ | ------ |
| Input        | ShadCN |
| Button       | ShadCN |
| Avatar       | ShadCN |
| DropdownMenu | ShadCN |

---

## 반응형 규칙

### Desktop

```text id="tt21gm"
좌측: 로고
중앙: 검색
우측: 알림 + 프로필
```

---

### Mobile

```text id="vxjx7n"
검색 축소
아이콘 중심 구성
Header 높이 56px 유지
```

---

## 인터랙션

| 액션       | 결과               |
| -------- | ---------------- |
| 로고 클릭    | `/` 이동           |
| 검색 Enter | `/search?q=` 이동  |
| 알림 클릭    | `/notifications` |
| 프로필 클릭   | `/profile`       |

---

# 5. FeedTabs 명세

## 파일 위치

```bash id="gqf19d"
app/FeedTabs.tsx
```

---

## 목적

피드 정렬 전환

---

## 탭 구성

| 탭  | 설명        |
| -- | --------- |
| 인기 | 좋아요 기반    |
| 최신 | 최신 업로드 기준 |

---

## 사용 컴포넌트

| 컴포넌트        | 타입     |
| ----------- | ------ |
| Tabs        | ShadCN |
| TabsList    | ShadCN |
| TabsTrigger | ShadCN |

---

## 상태 관리

```ts id="jlwmki"
type FeedTab = "trending" | "latest"
```

---

## UX 규칙

| 상태       | 디자인              |
| -------- | ---------------- |
| Active   | Primary Color    |
| Hover    | 밝기 증가            |
| Selected | Bottom Border 표시 |

---

# 6. FeedGrid 명세

## 파일 위치

```bash id="vtef8u"
app/FeedGrid.tsx
```

---

## 목적

반응형 Masonry 이미지 피드 출력

---

## 주요 기능

* Masonry Layout
* Infinite Scroll
* Lazy Loading
* Cursor Pagination
* Skeleton Loading

---

## Grid 규칙

| 화면 크기   | 컬럼 수 |
| ------- | ---- |
| ≥1440px | 6    |
| ≥1024px | 4    |
| ≥768px  | 3    |
| <768px  | 2    |



---

## Masonry 구현 방식

```text id="sqjz6r"
CSS Columns 기반 구현
```

---

## Infinite Scroll 방식

```text id="g9djlwm"
IntersectionObserver 사용
```

---

## 로딩 상태

| 상태           | 설명        |
| ------------ | --------- |
| loading      | 초기 로딩     |
| fetchingMore | 추가 요청     |
| hasNextPage  | 다음 페이지 여부 |

---

# 7. FeedCard 명세

## 파일 위치

```bash id="9k3c3d"
app/FeedCard.tsx
```

---

## 목적

이미지 콘텐츠 카드 출력

---

## 카드 구성

| 요소         | 설명             |
| ---------- | -------------- |
| 이미지 썸네일    | 메인 콘텐츠         |
| 작성자 Avatar | 작성자 표시         |
| 닉네임        | 작성자명           |
| 좋아요 수      | 좋아요 표시         |
| 공개 여부      | Public/Private |

---

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Card   | ShadCN |
| Avatar | ShadCN |
| Badge  | ShadCN |

---

## Hover UX

### Desktop

* 카드 확대
* Shadow 강화
* Overlay 노출
* 메타데이터 표시

---

### Mobile

* Hover 제거
* Tap 중심 인터랙션

---

## 카드 클릭 흐름

```text id="cvt0tm"
FeedCard 클릭
→ /images/[id]
→ 이미지 상세 이동
```

---

# 8. FeedSkeleton 명세

## 파일 위치

```bash id="oq9zq0"
app/FeedSkeleton.tsx
```

---

## 목적

초기 로딩 UX 개선

---

## 사용 컴포넌트

| 컴포넌트     | 타입     |
| -------- | ------ |
| Skeleton | ShadCN |

---

## UX 규칙

* Masonry 구조 유지
* 실제 카드 크기 반영
* Shimmer 애니메이션 사용

---

# 9. FeedEmpty 명세

## 파일 위치

```bash id="prf7ha"
app/FeedEmpty.tsx
```

---

## 목적

데이터 없음 상태 처리

---

## 표시 요소

| 요소                 | 설명           |
| ------------------ | ------------ |
| Empty Illustration | 빈 상태 이미지     |
| 안내 문구              | 콘텐츠 없음       |
| 생성 버튼              | `/create` 이동 |

---

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Button | ShadCN |

---

# 10. MobileBottomNav 명세

## 파일 위치

```bash id="1n9mxq"
app/MobileBottomNav.tsx
```

---

## 표시 조건

```text id="jlwmgl"
768px 이하에서만 노출
```

---

## 메뉴 구성

| 메뉴      | 이동         |
| ------- | ---------- |
| Home    | `/`        |
| Create  | `/create`  |
| Gallery | `/gallery` |
| Profile | `/profile` |

---

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Button | ShadCN |

---

## UX 규칙

* Safe Area 대응
* 현재 메뉴 Highlight
* Thumb Zone 고려

---

# 11. 상태 관리 명세

## 상태 구조

```ts id="wjh03d"
feedState = {
  activeTab,
  feeds,
  cursor,
  loading,
  fetchingMore,
  hasNextPage
}
```

---

## 권장 라이브러리

| 목적    | 라이브러리          |
| ----- | -------------- |
| 서버 상태 | TanStack Query |
| UI 상태 | Zustand        |

---

# 12. API 연동 명세

# 피드 조회 API

## 요청

```http id="th0kmb"
GET /api/feed
```

---

## Query Params

| 이름     | 타입     | 설명                |
| ------ | ------ | ----------------- |
| type   | string | trending/latest   |
| cursor | string | pagination cursor |
| limit  | number | 조회 개수             |

---

## 응답 구조

```ts id="rjpx1y"
{
  items: FeedItem[],
  nextCursor: string | null,
  hasNextPage: boolean
}
```

---

## FeedItem 타입

```ts id="c0zv6l"
type FeedItem = {
  id: string
  imageUrl: string
  likes: number
  isPublic: boolean
  createdAt: string
  author: {
    id: string
    name: string
    avatarUrl: string
  }
}
```

---

# 13. 사용자 흐름

## 메인 흐름

```text id="y4s8gg"
서비스 진입
→ 메인 피드 로딩
→ 이미지 탐색
→ Infinite Scroll
→ 카드 클릭
→ 이미지 상세 이동
```

---

## 검색 흐름

```text id="j5jvow"
검색 입력
→ Enter
→ 검색 페이지 이동
→ 결과 Grid 출력
```

---

# 14. 애니메이션 명세

## 페이지 진입

| 요소       | 효과                |
| -------- | ----------------- |
| Header   | Fade Down         |
| FeedCard | Fade Up           |
| Grid     | Stagger Animation |

---

## 카드 애니메이션

| 상태    | 효과         |
| ----- | ---------- |
| Hover | Elevation  |
| Click | Scale Down |
| Load  | Fade In    |

---

# 15. 접근성(A11y)

## 적용 항목

| 항목                  | 내용         |
| ------------------- | ---------- |
| aria-label          | 버튼 제공      |
| keyboard navigation | 지원         |
| focus visible       | outline 제공 |
| alt text            | 이미지 설명 제공  |

---

# 16. 성능 최적화

| 기능           | 방식                   |
| ------------ | -------------------- |
| 이미지 최적화      | next/image           |
| Lazy Loading | IntersectionObserver |
| Pagination   | Cursor 기반            |
| Skeleton     | 초기 UX 개선             |
| Memoization  | FeedCard 최적화         |

---

# 17. Frontend 테스트 항목

## UI 테스트

* Masonry Grid 정상 출력
* 반응형 컬럼 변경 확인
* Skeleton 표시 확인
* Bottom Navigation 노출 확인

---

## 인터랙션 테스트

* 카드 클릭 이동
* 탭 전환
* Infinite Scroll 동작
* Hover 애니메이션

---

## 성능 테스트

* Lazy Load 확인
* 초기 렌더 속도
* 스크롤 FPS 확인

---

# 메인페이지 Backend 기능명세서

# 1. API 구조

## 파일 위치

```bash id="wn10m0"
app/api/feed/route.ts
```

---

# 2. API 정의

## GET /api/feed

메인 피드 조회 API

---

## Query Parameters

| 이름     | 타입     | 설명                |
| ------ | ------ | ----------------- |
| type   | string | trending/latest   |
| cursor | string | pagination cursor |
| limit  | number | 기본 20             |

---

# 3. 응답 구조

```ts id="1v20fh"
{
  items: FeedItem[],
  nextCursor: string | null,
  hasNextPage: boolean
}
```

---

# 4. DB 설계

## 파일 위치

```bash id="2ybyzq"
db/schema.ts
```

---

# users 테이블

| 컬럼        | 타입   |
| --------- | ---- |
| id        | uuid |
| name      | text |
| avatarUrl | text |

---

# images 테이블

| 컬럼         | 타입        |
| ---------- | --------- |
| id         | uuid      |
| userId     | uuid      |
| imageUrl   | text      |
| prompt     | text      |
| style      | text      |
| ratio      | text      |
| likesCount | integer   |
| isPublic   | boolean   |
| createdAt  | timestamp |

---

# 5. 조회 조건

| 조건        | 설명                |
| --------- | ----------------- |
| 공개 작품만 조회 | isPublic = true   |
| 삭제 데이터 제외 | deletedAt IS NULL |
| limit 제한  | 최대 50             |

---

# 6. 정렬 규칙

## Trending

```text id="n46wfe"
likesCount DESC
createdAt DESC
```

---

## Latest

```text id="v1nh6w"
createdAt DESC
```

---

# 7. Pagination 설계

## 방식

```text id="aqx59q"
Cursor Pagination
```

---

## Cursor 기준

```text id="x6izc1"
createdAt + id 조합
```

---

# 8. 캐싱 전략

| 영역            | 전략       |
| ------------- | -------- |
| Trending Feed | ISR      |
| Latest Feed   | no-store |
| 이미지           | CDN 캐싱   |

---

# 9. 에러 처리

## 응답 구조

```ts id="gktlzu"
{
  error: string,
  message: string
}
```

---

## 에러 케이스

| 상황         | 처리      |
| ---------- | ------- |
| 잘못된 cursor | 400     |
| 서버 오류      | 500     |
| 데이터 없음     | 빈 배열 반환 |

---

# 10. Backend 테스트 항목

## API 테스트

* 인기순 조회 확인
* 최신순 조회 확인
* Pagination 확인
* limit 제한 확인

---

## 데이터 테스트

* 비공개 이미지 제외
* 작성자 Join 확인
* 좋아요 수 정상 반환

---

## 성능 테스트

* Infinite Scroll 부하 테스트
* 대량 데이터 응답 테스트
* Cursor Pagination 성능 테스트
