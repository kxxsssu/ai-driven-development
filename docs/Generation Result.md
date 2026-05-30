# 생성 결과 화면 기능명세서

> Design Guide `5-5. 생성 결과 화면` 기준 명세다. 생성 결과는 별도 라우트가
> 아니라 이미지 생성 화면(`/create`) 우측 영역에 함께 노출되며, 생성 옵션/이미지
> 상태는 `Image Create.md`의 `generation-store`를 공유한다.

---

# 프론트엔드 기능명세서

---

# 1. 기능 개요

## 목적

```text
생성 결과 저장 및 공유 유도
```

* 생성 완료된 이미지들을 Grid로 노출하고, 각 이미지에 대해
  Download / Save / Share / Regenerate 등의 후속 액션을 제공한다.

## 표시 조건

```text
generationStore.generatedImages.length > 0
```

> 구현 반영: 결과는 `/create` 페이지의 우측 영역에 인라인으로 표시된다.
> 결과가 없으면 빈 상태(Empty) UI를 노출한다.

---

# 2. 컴포넌트 구조

## 파일 위치

```text
/app/create/
├── page.tsx                 # 좌(컨트롤) / 우(결과 Grid) 2단 레이아웃
├── GeneratedResultGrid.tsx  # 결과 Grid + 빈 상태
└── GeneratedImageCard.tsx   # 개별 결과 카드 + 액션
```

> 구현 반영: 별도의 생성 결과 라우트(`/result`)는 만들지 않고 생성 화면
> 내부에 통합했다. 데이터는 `store/generation-store.ts`의 `generatedImages`를
> 구독한다.

---

# 3. GeneratedResultGrid 명세

## 사용 컴포넌트

* GeneratedImageCard
* lucide `Sparkles` (빈 상태 아이콘)

## 기능

* 생성 이미지 Grid 표시
* 결과 개수 헤더 표시 (`생성 결과 (N)`)
* 빈 상태 안내 UI

## Grid 규칙 (Desktop 전용)

| Width   | Columns |
| ------- | ------- |
| ≥1440px | 3       |
| 기본      | 2       |

> 구현 반영: 모바일 미지원으로 기본 2컬럼(`grid-cols-2`), 큰 화면에서 3컬럼
> (`2xl:grid-cols-3`)으로 단순화했다.

## 빈 상태(Empty)

| 요소     | 내용                                  |
| ------ | ----------------------------------- |
| 아이콘    | `Sparkles` (점선 박스 내 원형 배경)          |
| 안내 문구  | `프롬프트와 스타일을 설정하고 이미지를 생성해 보세요.`     |

---

# 4. GeneratedImageCard 명세

## 사용 컴포넌트

| 컴포넌트         | 타입     |
| ------------ | ------ |
| Card         | ShadCN |
| Button       | ShadCN |
| Badge        | ShadCN |
| DropdownMenu | ShadCN |
| Image        | next/image |

## 카드 포함 요소

```text
- 생성 이미지 (Hover 시 확대)
- 스타일 Badge
- Ratio Badge
- 생성 시간 (HH:MM)
- Download 버튼 (좌상단 아이콘)
- 추가 액션 메뉴 (우상단 ⋯)
- Save / Share / 재생성 버튼 (하단 액션 바)
```

## 액션 기능

| 액션               | 설명               | 구현 상태          |
| ---------------- | ---------------- | -------------- |
| Download         | 로컬 PC에 이미지 다운로드  | 구현 (blob 다운로드) |
| Save             | 내 갤러리 저장         | 목업 (Toast)     |
| Share            | 공개 피드 업로드        | 목업 (Toast)     |
| Regenerate       | 동일 Prompt 재생성    | 구현             |
| Generate Similar | 유사 생성            | 구현 (재생성 동작)    |
| Reuse Style      | 스타일 재사용          | 구현             |

> 구현 반영:
> - **Download**: 외부(cross-origin) 이미지는 `<a download>`가 무시되므로
>   `fetch`로 blob을 받아 ObjectURL로 다운로드한다. 파일명은
>   `canvashub-{id}.{ext}`(MIME 기반 확장자)이며, 좌상단 아이콘 버튼과
>   더보기(⋯) 메뉴에서 실행할 수 있다. 다운로드 중에는 `Loader2` 스피너로 표시.
> - **Save/Share**: DB·갤러리 미연동 상태로 Toast 알림 + 버튼 상태 변경
>   (`저장됨`/`공유됨`, disabled)만 수행하는 목업이다.
> - **Regenerate/Generate Similar**: `reuseSettings()`로 스토어 설정을
>   재적용한 뒤 `generate()`를 실행해 실제로 재생성한다.
> - **Reuse Style**: 설정만 재적용하고 재생성은 트리거하지 않는다.

---

## 결과 메타데이터

각 카드에 표시:

| 항목    | 표시 형식         |
| ----- | ------------- |
| 스타일   | `Badge` (secondary) |
| 비율    | `Badge` (outline) |
| 생성 시간 | `HH:MM` (ko-KR locale) |

---

# 5. 사용자 흐름

## 결과 확인 → 후속 액션

```text
Generate 완료
→ 결과 Grid 노출
→ 카드 액션 선택
   ├─ Download → 로컬 저장
   ├─ Save → 갤러리 저장(목업)
   ├─ Share → 공개 피드(목업)
   └─ Regenerate → 동일 설정 재생성
```

## 재생성 흐름

```text
Generated Image 선택
→ 재생성/유사 생성 클릭
→ reuseSettings()로 기존 설정 자동 입력
→ generate() 실행
→ Loading Overlay → 새 결과 노출
```

---

# 6. 상태 관리

## 관리 상태 (generation-store)

```ts
generatedImages: IGeneratedImage[]   // 결과 목록
prompt / selectedStyle / ratio       // reuseSettings 대상
```

## IGeneratedImage 타입

```ts
interface IGeneratedImage {
  id: string;
  url: string;
  style: ImageStyle;
  ratio: ImageRatio;
  prompt: string;
  createdAt: string;
}
```

> 구현 반영: 타입 정의는 `.cursorrules` 규칙에 따라 `types/index.ts`에 위치한다.

---

# 7. 접근성(A11y)

| 항목       | 적용                              |
| -------- | ------------------------------- |
| alt text | `{style} 스타일 생성 이미지`            |
| aria-label | Download / 추가 액션 버튼 라벨 제공      |
| 상태 전달    | 저장/공유 상태를 텍스트(`저장됨`/`공유됨`)로 병행 |
| 키보드      | DropdownMenu 기본 키보드 탐색 지원       |

---

# 8. 프론트엔드 테스트 항목

## 결과 Grid 테스트

* 결과 존재 시 Grid 정상 출력 여부
* 결과 없을 때 빈 상태 표시 여부
* 반응형 컬럼(2 → 3) 전환 여부
* 이미지 Lazy Loading 여부

## 액션 테스트

* Download 실행 및 파일명 규칙 여부
* Save/Share 시 Toast + 버튼 상태 변경 여부
* Regenerate 시 설정 재적용 + 재생성 여부

---

# 백엔드 기능명세서

> 본 화면 자체는 신규 API가 없다. 결과 데이터는 `Image Create.md`의 생성/조회
> API(`POST /api/generate`, `GET /api/generate/{jobId}`)를 통해 전달된다.
> Save(갤러리 저장)·Share(공개 전환)는 아래 명세를 기준으로 추후 연동한다.

---

# 1. 생성 결과 저장 API (미구현)

> 구현 상태: 미구현. 현재 Save/Share는 프론트 목업(Toast)이다.

## 파일 위치

```text
/app/api/generated/save/route.ts
```

## Method

```text
POST
```

## 기능

* 생성 이미지 저장 (images 테이블)
* 갤러리 등록
* 공개 여부(visibility) 저장

## Request Body

```json
{
  "imageId": "img_1",
  "url": "/generated/1.png",
  "prompt": "사이버펑크 미래 도시",
  "style": "Cyberpunk",
  "ratio": "16:9",
  "visibility": "private"
}
```

---

# 2. DB 설계 (images 테이블)

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

# 3. 백엔드 테스트 항목 (연동 시)

* 생성 결과 저장 여부
* 공개 상태(visibility) 저장 여부
* 비로그인 저장 차단 여부
