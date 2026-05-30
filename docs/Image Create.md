
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
├── GeneratedImageCard.tsx
└── StylePreviewPanel.tsx
```

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
- Style Preview
- 생성 결과 Grid
```

## Mobile (제거됨)

> 구현 반영: 모바일 버전을 개발하지 않기로 하여 Mobile 레이아웃은 제거했다.
> 데스크탑 2단 레이아웃(좌: 컨트롤 패널 / 우: 미리보기·결과 그리드)으로만
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

# StylePreviewPanel

## 파일 위치

```text
/app/create/StylePreviewPanel.tsx
```

## 기능

* 선택된 스타일 미리보기 표시
* 스타일별 대표 이미지 노출
* Fade Transition 적용

## 상태 관리

```text
previewImage: string
```

## 애니메이션

* opacity transition
* duration 300ms

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

## 파일 위치

```text
/app/create/GenerationLoadingOverlay.tsx
```

## 사용 컴포넌트

* ShadCN `Dialog`
* ShadCN `Progress`

## 기능

* 생성 진행 상태 표시
* 중앙 Overlay UI 제공

## 표시 데이터

```text
- Progress %
- 현재 스타일
- 상태 메시지
```

## UX 규칙

| 항목        | 규칙               |
| --------- | ---------------- |
| Overlay   | 전체 화면            |
| Blur      | backdrop-blur 적용 |
| Dismiss   | 닫기 불가            |
| Animation | Fade In 300ms    |

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
- Save 버튼
- Share 버튼
- Regenerate 버튼
```

## 액션 기능

| 액션               | 설명            |
| ---------------- | ------------- |
| Save             | 내 갤러리 저장      |
| Share            | 공개 피드 업로드     |
| Regenerate       | 동일 Prompt 재생성 |
| Generate Similar | 유사 생성         |
| Reuse Style      | 스타일 재사용       |

> 구현 반영: Save/Share는 DB·갤러리 미연동 상태로 Toast 알림과 버튼 상태
> 변경만 수행하는 목업이다. Regenerate/Reuse Style은 스토어 설정을 재사용해
> 실제로 동작한다. 실제 저장은 백엔드 연동(아래 Server Action) 단계에서 구현한다.

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

> 구현 반영: 백엔드는 목업이다. `POST /api/generate`가 job을 생성하고
> `GET /api/generate/[jobId]`가 경과 시간 기반 progress(0→100%)를 반환한다.
> Job 저장소는 `lib/mock/generation-data.ts`의 globalThis Map이며, 완료 시
> picsum.photos 이미지를 비율에 맞춰 생성한다. 폴링 간격은 데모 체감을 위해
> 약 800ms로 동작한다(명세상 3초 → 추후 실제 연동 시 조정).

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
      "id": "img_1",
      "url": "/generated/1.png"
    }
  ]
}
```

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
* 닫기 방지 여부

---

# 결과 Grid 테스트

* 반응형 Grid 정상 동작 여부
* 이미지 Lazy Loading 여부

---

# 백엔드 기능명세서

> 구현 상태: 생성/조회 API는 목업으로 구현됐다.
> - `app/api/generate/route.ts` (POST, Zod 유사 검증 + jobId 발급)
> - `app/api/generate/[jobId]/route.ts` (GET, progress·images 반환)
> - Job 저장소: `lib/mock/generation-data.ts` globalThis Map (DB 미연동)
> 아직 미구현: 실제 AI Provider 호출, DB 스키마(images/generation_jobs),
> 생성 결과 저장 API(`/api/generated/save`), Server Action(`actions.ts`).
> 본 명세를 기준으로 실제 백엔드 연동 단계에서 구현한다.

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
* AI Provider 호출
* Job Queue 저장

## Request Body

```json
{
  "prompt": "사이버펑크 미래 도시",
  "style": "Cyberpunk",
  "ratio": "16:9",
  "count": 4
}
```

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

* 생성 상태 반환
* Progress 반환
* 완료 시 이미지 URL 반환

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

# 2. DB 설계

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

# 3. Server Action 사용 범위

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

# 4. 생성 Polling 전략

## 방식

```text
3초 간격 Polling
```

## 종료 조건

| 조건        | 동작         |
| --------- | ---------- |
| completed | Polling 종료 |
| failed    | 에러 표시      |
| timeout   | 재시도 유도     |

---

# 5. 에러 처리 규칙

| 상황            | 처리               |
| ------------- | ---------------- |
| 생성 실패         | Toast 표시         |
| API Timeout   | Retry 버튼         |
| Validation 실패 | Input Highlight  |
| 서버 오류         | Generic Error 표시 |

---

# 6. 백엔드 테스트 항목

---

# API 테스트

* 생성 요청 성공 여부
* Validation 정상 동작 여부
* Progress 반환 여부
* 완료 응답 반환 여부

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
