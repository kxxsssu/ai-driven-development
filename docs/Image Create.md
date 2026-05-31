
# 프론트엔드 기능명세서

---

# 1. 페이지 구조

## 페이지 경로

```text
/app/create/page.tsx
```

## 관련 컴포넌트 구조

```text
/app/create/
├── page.tsx
├── PromptSection.tsx
├── StyleSelector.tsx
├── RatioSelector.tsx
├── GenerationCountStepper.tsx
├── GenerateButton.tsx
├── GenerationLoadingOverlay.tsx
├── GeneratedResultGrid.tsx
└── GeneratedImageCard.tsx
```

> 구현 반영: 스타일 미리보기(`StylePreviewPanel.tsx`)는 제거했다.

## 공통 컴포넌트

```text
/components/ui/   # ShadCN 공통 컴포넌트 (select, progress, dialog, textarea 등)
```

> 구현 반영: 별도 공통 컴포넌트(PromptInput/ResponsiveImageCard 등)를 만들지
> 않고, 페이지 전용 컴포넌트(`app/create/*`)와 ShadCN UI 컴포넌트를 조합해
> 구현했다. 생성 옵션/이미지 상태는 `store/generation-store.ts`로 관리한다.

---

# 2. 화면 레이아웃 명세

---

# 전체 레이아웃

## Desktop

```text
좌측:
- Prompt 입력
- Style 선택
- Ratio 선택
- 생성 개수

우측:
- 생성 결과 Grid
```

> 구현 반영: 스타일 미리보기는 제거되어, 우측 영역은 생성 결과 Grid만
> 표시한다.

## Mobile (제거됨)

> 구현 반영: 모바일 버전을 개발하지 않기로 하여 Mobile 레이아웃은 제거했다.
> 데스크탑 2단 레이아웃(좌: 컨트롤 패널 / 우: 생성 결과 그리드)으로만
> 구현한다.

---

# 3. 컴포넌트 상세 명세

---

# PromptSection

## 파일 위치

```text
/app/create/PromptSection.tsx
```

## 사용 컴포넌트

* ShadCN `Textarea`
* ShadCN `Label`

## 기능

* Multiline Prompt 입력
* 자동 높이 확장
* 최대 글자수 제한
* Placeholder 제공

## 상태 관리

```text
prompt: string
```

## UX 규칙

| 항목    | 규칙     |
| ----- | ------ |
| 최소 입력 | 1자 이상  |
| 최대 길이 | 500자   |
| 자동 확장 | 최대 8줄  |
| Enter | 줄바꿈 허용 |

---

# StyleSelector

## 파일 위치

```text
/app/create/StyleSelector.tsx
```

## 사용 컴포넌트

* ShadCN `Select`

> 구현 반영: Popover + Command 콤보박스 대신 단순 `Select`로 구현했다.
> (옵션 5개로 충분하며 Keyboard Navigation은 Select가 기본 제공)

## 기능

* 스타일 Dropdown 선택
* Keyboard Navigation 지원
* Style Preview 연동

## 상태 관리

```text
selectedStyle: string
```

## 옵션 목록

```text
Anime
Realistic
Fantasy
Cyberpunk
Oil Painting
```

## UX 규칙

| 상태       | 동작                |
| -------- | ----------------- |
| Default  | "Select Style" 표시 |
| Open     | Dropdown 노출       |
| Selected | 선택 스타일 표시         |
| Keyboard | 방향키 이동 가능         |

---

# StylePreviewPanel (제거됨)

> 구현 반영: 스타일 미리보기 기능은 제거했다. 따라서 `StylePreviewPanel.tsx`
> 컴포넌트와 `getStylePreviewUrl` 헬퍼도 함께 삭제했다. 아래 원본 명세는
> 향후 재도입 시 참고용으로 보존한다.

- 기능: 선택된 스타일 미리보기 표시, 스타일별 대표 이미지 노출, Fade Transition
- 상태: `previewImage: string`
- 애니메이션: opacity transition, duration 300ms

---

# RatioSelector

## 파일 위치

```text
/app/create/RatioSelector.tsx
```

## 사용 컴포넌트

* 커스텀 토글 버튼 그룹 (Button 스타일 기반)

> 구현 반영: ToggleGroup 의존성 추가 없이 단일 선택 토글 버튼 그룹으로
> 구현했다. (`role="group"` + `aria-pressed` 적용)

## 기능

* 이미지 비율 선택

## 선택 옵션

```text
1:1
16:9
9:16
```

## 상태 관리

```text
ratio: string
```

---

# GenerationCountStepper

## 파일 위치

```text
/app/create/GenerationCountStepper.tsx
```

## 사용 컴포넌트

* ShadCN `Button`
* ShadCN `Input`

## 기능

* 생성 개수 조절
* 최소/최대 제한

## 상태 관리

```text
count: number
```

## 제한 규칙

| 항목 | 값 |
| -- | - |
| 최소 | 1 |
| 최대 | 4 |

---

# GenerateButton

## 파일 위치

```text
/app/create/GenerateButton.tsx
```

## 사용 컴포넌트

* ShadCN `Button`
* ShadCN `Spinner`

## 기능

* 이미지 생성 요청
* 상태별 UI 변경

## 활성 조건

```text
- Prompt 입력 완료
- Style 선택 완료
```

## 버튼 상태

| 상태       | UI            |
| -------- | ------------- |
| Disabled | opacity 40%   |
| Active   | Primary Color |
| Loading  | Spinner 표시    |

---

# GenerationLoadingOverlay

> Design Guide `5-4. 이미지 생성 로딩 UX` 대응 컴포넌트. 생성 대기 시간을
> 몰입형 경험으로 전환하기 위해 화면 중앙 Overlay로 진행 상태를 실시간
> 표시한다. (이전에 별도 문서 `Generation Loading.md`로 분리했던 명세를 본
> 섹션으로 통합했다.)

## 파일 위치

```text
/app/create/GenerationLoadingOverlay.tsx
```

## 사용 컴포넌트

| 컴포넌트     | 타입     | 용도            |
| -------- | ------ | ------------- |
| Dialog   | ShadCN | 중앙 Overlay 구성 |
| Progress | ShadCN | 진행률 바         |

## 표시 조건

```text
generationStore.loading === true
```

* `Generate` 버튼 클릭 → `generate()` 액션 실행 시 `loading: true`로 전환되며
  Overlay가 노출된다.
* 완료(`completed`) / 실패(`failed`) / 타임아웃 시 `loading: false`로 전환되어
  Overlay가 닫힌다.

## 기능

* 생성 진행 상태(Progress %) 실시간 표시
* 중앙 Overlay UI 제공 (Dark Blur 배경)
* 진행률 구간별 상태 메시지 전환 (몰입형 대기 경험)
* 생성 중 닫기(Dismiss) 차단으로 중복 요청 방지

## 화면 구성

```text
┌──────────────────────────────────┐
│  (Dark Blur Backdrop)            │
│      Generating Artwork...       │  ← DialogTitle
│            ┌──────┐              │
│            │ 65%  │              │  ← AI Animation + Progress %
│            └──────┘              │
│      ▓▓▓▓▓▓▓▓░░░░░░░░  (Bar)      │  ← Progress 바
│        Style: Cyberpunk          │  ← 스타일 정보
│      AI가 이미지를 그리고 있어요    │  ← 단계별 상태 메시지
└──────────────────────────────────┘
```

## 표시 데이터

```text
loading: boolean                  # Overlay 노출 여부
progress: number                  # 0 ~ 100
selectedStyle: ImageStyle | null  # 현재 스타일 (없으면 Style 줄 미표시)
statusMessage: string             # progress 구간별 메시지
```

> 구현 반영: 세 상태값을 `useGenerationStore` selector로 개별 구독하고,
> 상태 메시지는 `getGenerationStatusMessage(progress)` 헬퍼
> (`lib/generation-options.ts`)로 파생한다.

## 단계별 상태 메시지

| Progress 구간 | 메시지              |
| ----------- | ---------------- |
| 0 ~ 24%     | 프롬프트를 분석하고 있어요   |
| 25 ~ 59%    | AI가 이미지를 그리고 있어요 |
| 60 ~ 89%    | 디테일을 다듬고 있어요     |
| 90 ~ 99%    | 거의 다 됐어요         |
| 100%        | 곧 결과를 보여드릴게요     |

> 구현 반영: 메시지 매핑은 `lib/generation-options.ts`의
> `getGenerationStatusMessage`에 단일 정의하고, 메시지 변경 시 `fade-in`
> 트랜지션과 `aria-live="polite"`로 부드럽게/접근성 있게 갱신한다.

## 애니메이션 가이드

| 타입            | 설명          | 구현                                         |
| ------------- | ----------- | ------------------------------------------ |
| Pulse         | 생성 흐름 표현    | `animate-pulse` (Gradient 원형)              |
| Ping          | AI 처리 느낌 강조 | `animate-ping` (반투명 원형 확산)                 |
| Gradient Flow | AI 처리 느낌    | `bg-gradient-to-br from-primary to-accent` |
| Fade In       | Overlay 진입  | ShadCN Dialog 기본 Fade (≈300ms)             |

> 구현 반영: Design Guide의 Shimmer는 결과 그리드/스켈레톤 쪽에서 사용하고,
> 본 Overlay 중앙 애니메이션은 Pulse + Ping + Gradient 조합으로 구현했다.

## UX 규칙

| 항목        | 규칙               | 구현                                |
| --------- | ---------------- | --------------------------------- |
| Overlay   | 전체 화면 중앙         | ShadCN Dialog 중앙 정렬               |
| Blur      | backdrop-blur 적용 | Dialog Overlay `backdrop-blur`    |
| Dismiss   | 닫기 불가            | 외부 클릭/ESC/닫기 버튼 모두 차단             |
| Animation | Fade In 300ms    | Dialog 기본 트랜지션                    |
| Progress  | 실시간 갱신           | 폴링 응답마다 `progress` 갱신             |

> 구현 반영: 닫기 차단은 `onPointerDownOutside`·`onEscapeKeyDown`·
> `onInteractOutside`를 모두 `preventDefault()`하고, 우상단 닫기 버튼은
> `[&>button]:hidden`으로 숨겨 구현했다.

## 진행률(Progress) 연동

```text
generate() 실행
→ loading: true, progress: 0
→ POST /api/generate (jobId 발급)
→ GET /api/generate/{jobId} 폴링 (≈1초 간격)
→ 응답 progress로 상태/메시지 실시간 갱신
→ completed: progress 100 → loading: false (Overlay 닫힘)
```

| 종료 조건     | Overlay 동작            | 부가 처리       |
| --------- | --------------------- | ----------- |
| completed | progress 100% → 닫힘    | 결과 Grid 노출  |
| failed    | 닫힘                    | Toast 에러 표시 |
| timeout   | 닫힘 (2분 초과)           | Toast 에러 표시 |

> 구현 반영: 폴링/진행률/에러 처리는 `store/generation-store.ts`의 `generate()`
> 액션에 포함된다. `POLL_INTERVAL_MS = 1000`, `POLL_TIMEOUT_MS = 120000`.
> Replicate 402(크레딧 부족) 등 API 에러 메시지는 Sonner `toast.error`로 표시하고
> `finally` 블록에서 `loading: false`로 Overlay를 닫는다.

## 접근성(A11y)

| 항목          | 적용                                  |
| ----------- | ----------------------------------- |
| DialogTitle | `Generating Artwork...` 제공 (스크린리더용) |
| Focus Trap  | Dialog 기본 포커스 트랩 적용                  |
| 상태 전달       | `{progress}%` 숫자 + `aria-live` 메시지 병행 |
| Dismiss 차단  | 생성 중 ESC/외부 클릭 비활성화                  |

---

# GeneratedResultGrid

## 파일 위치

```text
/app/create/GeneratedResultGrid.tsx
```

## 사용 컴포넌트

* ResponsiveImageCard
* GeneratedImageCard

## 기능

* 생성 이미지 Grid 표시
* 반응형 레이아웃 제공

## Grid 규칙 (Desktop 전용)

| Width   | Columns |
| ------- | ------- |
| ≥1440px | 3       |
| 기본      | 2       |

> 구현 반영: 모바일 미지원으로 기본 2컬럼(`grid-cols-2`), 큰 화면에서 3컬럼
> (`2xl:grid-cols-3`)으로 단순화했다.

---

# GeneratedImageCard

## 파일 위치

```text
/app/create/GeneratedImageCard.tsx
```

## 사용 컴포넌트

* ShadCN `Card`
* ShadCN `DropdownMenu`
* ShadCN `Button`

## 카드 포함 요소

```text
- 생성 이미지
- 스타일 정보
- Ratio 정보
- 생성 시간
- Download 버튼
- Save 버튼
- Share 버튼
- Regenerate 버튼
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
>   `canvashub-{id}.{ext}`(MIME 기반 확장자)이며, 카드 좌상단 아이콘 버튼과
>   더보기(⋯) 메뉴에서 실행할 수 있다.
> - Save/Share는 DB·갤러리 미연동 상태로 Toast 알림과 버튼 상태 변경만
>   수행하는 목업이다. Regenerate/Reuse Style은 스토어 설정을 재사용해 실제로
>   동작한다. 실제 저장은 백엔드 연동(아래 Server Action) 단계에서 구현한다.

---

# 4. 사용자 흐름

---

# 생성 플로우

```text
Prompt 입력
→ Style 선택
→ Ratio 선택
→ 생성 개수 설정
→ Generate 클릭
→ Loading Overlay 표시
→ 생성 완료
→ 결과 Grid 노출
```

---

# 재생성 플로우

```text
Generated Image 선택
→ Regenerate 클릭
→ 기존 설정 자동 입력
→ Generate 실행
```

---

# 5. 상태 관리 구조

## 추천 방식

```text
Zustand 사용
```

## Store 위치

```text
store/generation-store.ts
```

> 구현 반영: 경로는 `store/generation-store.ts`이며, 생성 요청·폴링 로직도
> 이 스토어의 `generate()` 액션에 포함된다.

## 관리 상태

```text
prompt
selectedStyle
ratio
count
loading
progress
generatedImages
```

---

# 6. API 연동 명세

> 구현 반영: Replicate API(`black-forest-labs/flux-schnell`)로 실제 이미지를 생성한다.
> `POST /api/generate`가 Replicate prediction을 생성하고 jobId를 발급하며,
> `GET /api/generate/[jobId]`가 Replicate prediction 상태를 폴링해 progress·images를
> 반환한다. Job 저장소는 `lib/generation/job-store.ts`의 globalThis Map(DB 미연동)이며,
> `.env.local`에 `REPLICATE_API_TOKEN` 필요. 폴링 간격 1초, 타임아웃 2분.
> flux-schnell input 매핑 상세는 아래 **「Replicate Input 매핑」** 및
> 백엔드 기능명세서 **「2. Replicate / flux-schnell Input 매핑」** 참고.

---

# Replicate Input 매핑 (앱 옵션 → flux-schnell schema)

## 모델

```text
black-forest-labs/flux-schnell
```

## 앱 Request Body → Replicate input 변환

| 앱 필드 (POST /api/generate) | flux-schnell schema 필드 | 매핑 방식 |
| --- | --- | --- |
| `prompt` | `prompt` (required) | trim 후 스타일 suffix와 결합 |
| `style` | *(없음)* | schema에 style 필드 없음 → `prompt` suffix로 반영 |
| `ratio` | `aspect_ratio` | 1:1 / 16:9 / 9:16 → enum 값 직접 전달 |
| `count` | `num_outputs` | 1~4 정수, 범위 밖 값은 clamp |

## 스타일 → prompt suffix

| style (ImageStyle) | prompt suffix |
| --- | --- |
| Anime | `anime style illustration, vibrant colors` |
| Realistic | `photorealistic, highly detailed, natural lighting` |
| Fantasy | `fantasy art, magical atmosphere, epic composition` |
| Cyberpunk | `cyberpunk, neon lights, futuristic cityscape` |
| Oil Painting | `oil painting, textured brushstrokes, classical art` |

결합 예: `"사이버펑크 미래 도시"` + Cyberpunk →
`"사이버펑크 미래 도시, cyberpunk, neon lights, futuristic cityscape"`

## schema 고정값 (UI 미노출, default 명시)

| schema 필드 | 전송 값 | schema default | 비고 |
| --- | --- | --- | --- |
| `num_inference_steps` | `4` | 4 | flux-schnell 권장값 (max 4) |
| `go_fast` | `true` | true | fp8 최적화, 속도 우선 |
| `megapixels` | `"1"` | `"1"` | 약 1MP 해상도 |
| `output_format` | `"webp"` | `"webp"` | |
| `output_quality` | `80` | 80 | 0~100 |
| `disable_safety_checker` | `false` | false | |
| `seed` | *(미전달)* | — | UI 없음, 매 생성 랜덤 |

## Replicate input 예시 (count: 4, ratio: 16:9, style: Cyberpunk)

```json
{
  "prompt": "사이버펑크 미래 도시, cyberpunk, neon lights, futuristic cityscape",
  "aspect_ratio": "16:9",
  "num_outputs": 4,
  "num_inference_steps": 4,
  "go_fast": true,
  "megapixels": "1",
  "output_format": "webp",
  "output_quality": 80,
  "disable_safety_checker": false
}
```

## aspect_ratio enum (schema 전체 / 앱 지원 범위)

schema enum: `1:1`, `16:9`, `21:9`, `3:2`, `2:3`, `4:5`, `5:4`, `3:4`, `4:3`, `9:16`, `9:21`

앱 UI 지원: `1:1`, `16:9`, `9:16` (schema enum의 부분집합)

## 구현 파일

| 파일 | 역할 |
| --- | --- |
| `lib/replicate/flux-schnell-schema.ts` | schema 타입·enum·default·limit 상수 |
| `lib/replicate/build-input.ts` | `buildReplicateInput()`, `buildStyledPrompt()` |
| `lib/replicate/client.ts` | Replicate 클라이언트, `FLUX_SCHNELL_MODEL` |
| `lib/generation/job-store.ts` | prediction 생성·상태 조회·Job 캐시 |

---

# 생성 요청

## 호출 방식

```text
POST /api/generate
```

## 요청 데이터

```json
{
  "prompt": "사이버펑크 미래 도시",
  "style": "Cyberpunk",
  "ratio": "16:9",
  "count": 4
}
```

## 응답 데이터

```json
{
  "jobId": "job_xxx",
  "status": "queued"
}
```

---

# 생성 상태 Polling

## 호출 방식

```text
GET /api/generate/{jobId}
```

## 응답 데이터

```json
{
  "status": "processing",
  "progress": 65,
  "images": []
}
```

---

# 완료 응답

```json
{
  "status": "completed",
  "progress": 100,
  "images": [
    {
      "id": "job_xxx_img_1",
      "url": "https://replicate.delivery/pbxt/.../output.webp",
      "style": "Cyberpunk",
      "ratio": "16:9",
      "prompt": "사이버펑크 미래 도시",
      "createdAt": "2026-05-31T01:00:00.000Z"
    }
  ]
}
```

> 완료 시 `images[].url`은 Replicate CDN(`replicate.delivery`) URL이다.
> `next.config.mjs`에 해당 도메인이 등록되어 있어야 `next/image`로 표시 가능하다.

---

# 7. 프론트엔드 테스트 항목

---

# 입력 테스트

* Prompt 입력 가능 여부
* 최대 글자수 제한 동작 여부
* 자동 높이 확장 여부

---

# Style Dropdown 테스트

* Dropdown Open 여부
* Keyboard Navigation 동작 여부
* 선택 상태 표시 여부

---

# Ratio 테스트

* 단일 선택 유지 여부
* 선택 상태 UI 반영 여부

---

# Generate 버튼 테스트

* 조건 충족 전 Disabled 여부
* Loading 상태 전환 여부

---

# Overlay 테스트

* 생성 중 Overlay 표시 여부
* Progress 실시간 갱신 여부
* 진행률 구간별 상태 메시지 전환 여부
* 닫기 방지 여부 (외부 클릭 / ESC / 닫기 버튼)

---

# 결과 Grid 테스트

* 반응형 Grid 정상 동작 여부
* 이미지 Lazy Loading 여부

---

# 백엔드 기능명세서

> 구현 상태: 생성/조회 API는 Replicate(`black-forest-labs/flux-schnell`) 연동으로 구현됐다.
> - `app/api/generate/route.ts` (POST, 검증 + Replicate prediction 생성 + jobId 발급)
> - `app/api/generate/[jobId]/route.ts` (GET, Replicate prediction 상태 조회)
> - Replicate 클라이언트: `lib/replicate/client.ts`
> - Input 빌더: `lib/replicate/build-input.ts`, schema: `lib/replicate/flux-schnell-schema.ts`
> - 에러 변환: `lib/replicate/format-error.ts` (402 크레딧 부족 등)
> - Job 저장소: `lib/generation/job-store.ts` globalThis Map (DB 미연동)
> - 환경 변수: `.env.local` → `REPLICATE_API_TOKEN` (`.env.example` 참고)
> - `next.config.mjs`에 `replicate.delivery` 이미지 도메인 등록
> - 세션 쿠키 검증: POST/GET 모두 로그인 필수, Job은 userId 소유권 확인
> 아직 미구현: DB 스키마(images/generation_jobs), 생성 결과 저장 API
> (`/api/generated/save`), Server Action(`actions.ts`).

---

# 1. API 구조

---

# 이미지 생성 API

## 파일 위치

```text
/app/api/generate/route.ts
```

## Method

```text
POST
```

## 기능

* 이미지 생성 Job 생성
* Replicate `black-forest-labs/flux-schnell` prediction 호출
* Job Queue 저장 (globalThis Map, predictionId 매핑)

## Request Body

```json
{
  "prompt": "사이버펑크 미래 도시",
  "style": "Cyberpunk",
  "ratio": "16:9",
  "count": 4
}
```

| 필드 | 타입 | 제약 | Replicate 매핑 |
| --- | --- | --- | --- |
| prompt | string | 1~500자 | `prompt` (+ style suffix) |
| style | ImageStyle | Anime / Realistic / Fantasy / Cyberpunk / Oil Painting | prompt suffix |
| ratio | ImageRatio | 1:1 / 16:9 / 9:16 | `aspect_ratio` |
| count | number | 1~4 정수 | `num_outputs` |

## Response

```json
{
  "jobId": "job_xxx",
  "status": "queued"
}
```

---

# 생성 상태 조회 API

## 파일 위치

```text
/app/api/generate/[jobId]/route.ts
```

## Method

```text
GET
```

## 기능

* Replicate prediction 상태 조회
* Progress 반환 (starting/processing 시 경과 시간 기반 추정)
* 완료 시 `replicate.delivery` 이미지 URL 배열 반환

## Replicate status → 앱 status 매핑

| Replicate prediction.status | 앱 status | progress |
| --- | --- | --- |
| starting | processing | 15 |
| processing | processing | 10~95 (경과 시간 추정) |
| succeeded | completed | 100 |
| failed / canceled | failed | 0 |

## Response

```json
{
  "status": "processing",
  "progress": 65,
  "images": []
}
```

---

# 생성 결과 저장 API

## 파일 위치

```text
/app/api/generated/save/route.ts
```

## Method

```text
POST
```

## 기능

* 생성 이미지 저장
* Gallery 등록
* 공개 여부 저장

---

# 2. Replicate / flux-schnell Input 매핑

## 모델 식별자

```text
black-forest-labs/flux-schnell
```

## schema required 필드

* `prompt` — 유일한 required 필드. 앱에서는 사용자 prompt + style suffix를 결합해 전달.

## 앱 옵션 → schema 필드 매핑

| 앱 옵션 | schema 필드 | 구현 |
| --- | --- | --- |
| prompt | `prompt` | `buildStyledPrompt()` |
| style | *(없음)* | `STYLE_SUFFIX` 테이블로 prompt에 append |
| ratio | `aspect_ratio` | `APP_RATIO_TO_FLUX` (1:1, 16:9, 9:16) |
| count | `num_outputs` | `clampCount()` (MIN 1, MAX 4) |

## schema optional 필드 (고정 전송)

| schema 필드 | 전송 값 | schema default | limit |
| --- | --- | --- | --- |
| `num_inference_steps` | 4 | 4 | 1~4 |
| `go_fast` | true | true | boolean |
| `megapixels` | `"1"` | `"1"` | `"1"` \| `"0.25"` |
| `output_format` | `"webp"` | `"webp"` | webp / jpg / png |
| `output_quality` | 80 | 80 | 0~100 |
| `disable_safety_checker` | false | false | boolean |
| `seed` | 미전달 | — | integer (재현용, UI 미지원) |

## aspect_ratio enum (전체)

```text
1:1, 16:9, 21:9, 3:2, 2:3, 4:5, 5:4, 3:4, 4:3, 9:16, 9:21
```

앱 `ImageRatio`는 `1:1`, `16:9`, `9:16`만 지원 (enum 부분집합).

## 구현 파일

```text
lib/replicate/flux-schnell-schema.ts  — IFluxSchnellInput, FLUX_SCHNELL_DEFAULTS, FLUX_SCHNELL_LIMITS
lib/replicate/build-input.ts          — buildReplicateInput(), buildStyledPrompt()
lib/generation/job-store.ts           — predictions.create / predictions.get 호출
```

## API 에러 코드 (Replicate 연동)

| HTTP | error 코드 | 사용자 메시지 (예) |
| --- | --- | --- |
| 402 | INSUFFICIENT_CREDIT | Replicate 크레딧 부족 |
| 401 | INVALID_REPLICATE_TOKEN | API 토큰 무효 |
| 429 | RATE_LIMITED | 요청 한도 초과 |
| 503 | REPLICATE_NOT_CONFIGURED | REPLICATE_API_TOKEN 미설정 |

---

# 3. DB 설계

---

# images 테이블

## 파일 위치

```text
/db/schema.ts
```

## 컬럼 구조

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

# generation_jobs 테이블

| 컬럼        | 타입        |
| --------- | --------- |
| id        | uuid      |
| userId    | uuid      |
| status    | varchar   |
| progress  | integer   |
| createdAt | timestamp |

---

# 4. Server Action 사용 범위

## 사용 위치

```text
/app/create/actions.ts
```

## 사용 기능

* Save 처리
* 공개 여부 토글
* Regenerate 실행

## 사용 이유

```text
간단한 단일 액션 처리 최적화
```

---

# 5. 생성 Polling 전략

## 방식

```text
1초 간격 Polling (store/generation-store.ts)
```

## 타임아웃

```text
120초 (2분) — Replicate 실제 생성 시간 반영
```

## 종료 조건

| 조건        | 동작         |
| --------- | ---------- |
| completed | Polling 종료 |
| failed    | 에러 표시      |
| timeout   | 재시도 유도     |

---

# 6. 에러 처리 규칙

| 상황            | 처리               |
| ------------- | ---------------- |
| 생성 실패         | Toast 표시         |
| Replicate 402 (크레딧 부족) | Toast — billing 안내 |
| Replicate 401/429 | Toast — 토큰/한도 안내 |
| API Timeout (2분) | Toast — 재시도 유도 |
| Validation 실패 | Input Highlight  |
| 서버 오류         | Generic Error 표시 |

---

# 7. 백엔드 테스트 항목

---

# API 테스트

* 생성 요청 성공 여부 (Replicate prediction 생성)
* Validation 정상 동작 여부 (prompt/style/ratio/count)
* flux-schnell input 매핑 정확성 (aspect_ratio, num_outputs, prompt suffix)
* Progress 반환 여부
* 완료 응답 `replicate.delivery` URL 반환 여부
* 402 크레딧 부족 시 사용자 메시지 표시 여부

---

# Polling 테스트

* 진행률 갱신 여부
* 완료 상태 전환 여부
* 실패 상태 처리 여부

---

# DB 테스트

* 생성 데이터 저장 여부
* Gallery 저장 여부
* 공개 상태 저장 여부

---

# 보안 테스트

* 비로그인 접근 차단 여부
* 사용자별 이미지 접근 제한 여부
* 잘못된 JobId 접근 차단 여부
