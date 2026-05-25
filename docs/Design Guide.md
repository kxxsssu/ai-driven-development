# 1. 프로젝트 개요

## 제품명

CanvasHub

## 제품 정의

AI 이미지 생성과 커뮤니티 기능을 결합한 창작 플랫폼

## 핵심 경험

```text id="u4c0hy"
생성
→ 저장
→ 공개
→ 탐색
→ 반응
→ 재창작
```

## UX 목표

| 목표        | 설명               |
| --------- | ---------------- |
| 쉬운 이미지 생성 | 초보자도 쉽게 생성 가능    |
| 몰입형 탐색 경험 | 이미지 중심 피드 제공     |
| 창작 지속성    | 생성 이후 공유/재창작 연결  |
| 커뮤니티 활성화  | 좋아요 및 공개 기반 상호작용 |
| 반응형 UX    | 모바일/데스크탑 최적화     |

---

# 2. 디자인 컨셉 및 원칙

## 디자인 키워드

* Modern
* Creative
* Minimal
* Community Driven
* Immersive

---

## 디자인 철학

### Creation First

AI 이미지 생성 경험을 가장 빠르고 직관적으로 제공한다.

### Community Native

생성 후 자연스럽게 공유와 탐색으로 이어지도록 설계한다.

### Visual Immersion

텍스트보다 이미지를 중심으로 콘텐츠 소비 경험을 구성한다.

---

# 3. 정보 구조(IA)

```text id="vw4y3e"
로그인
 ↓
메인 피드
 ├─ 이미지 생성
 ├─ 이미지 상세
 ├─ 내 갤러리
 └─ 프로필

이미지 생성
 ↓
생성 결과
 ↓
저장 / 공개 / 재생성
```

---

# 4. 사용자 흐름(User Flow)

## 핵심 사용자 흐름

```text id="d9c7n3"
회원가입
→ 메인 피드 탐색
→ 이미지 생성
→ 스타일 선택
→ 이미지 생성 실행
→ 생성 결과 확인
→ 저장 및 공개
→ 커뮤니티 공유
→ 좋아요/탐색
→ 재방문
```

---

# 5. 주요 화면 UX 가이드

---

# 5-1. 로그인 화면

## 목적

빠른 서비스 진입 제공

## 주요 구성

* CanvasHub 로고
* Google 로그인
* Kakao 로그인
* 이메일 입력
* 비밀번호 입력
* 로그인 버튼
* 회원가입 링크

## UX 포인트

* 중앙 정렬 구조
* 모바일 퍼스트
* 소셜 로그인 우선 배치

---

# 5-2. 메인 피드 화면

## 목적

이미지 탐색 및 커뮤니티 콘텐츠 소비

## 주요 구성

상단 헤더:

* 로고
* 검색
* 알림
* 프로필

탭:

* 인기
* 최신

콘텐츠:

* 반응형 이미지 카드 Grid
* Infinite Scroll

카드 정보:

* 이미지 썸네일
* 작성자
* 좋아요 수

---

## 반응형 Grid 규칙

| 화면 크기   | 카드 수 |
| ------- | ---- |
| ≥1440px | 6열   |
| ≥1024px | 4열   |
| ≥768px  | 3열   |
| <768px  | 2열   |

---

## UX 포인트

* Masonry Grid 기반
* 이미지 중심 UI
* Hover 시 정보 노출
* Lazy Loading 적용

---

# 5-3. 이미지 생성 화면

## 목적

AI 이미지 생성 경험 제공

---

## 사용자 흐름

```text id="xg0k4v"
Prompt 입력
→ Style Dropdown 선택
→ Ratio 선택
→ 생성 개수 선택
→ Generate 버튼 클릭
→ 중앙 로딩 애니메이션
→ 생성 결과 확인
```

---

## 화면 구성

### Prompt 입력 영역

포함 요소:

* Multiline Input
* Placeholder Prompt
* 자동 높이 확장

예시:
“사이버펑크 미래 도시”

---

### Style 선택 영역

Dropdown Menu 기반 구성

예시:

```text id="x5g8vn"
Style
[ Cyberpunk ▼ ]
```

---

## Dropdown 옵션 예시

* Anime
* Realistic
* Fantasy
* Cyberpunk
* Oil Painting

---

## 스타일 선택 UX 규칙

| 상태       | 설명               |
| -------- | ---------------- |
| Default  | Select Style 표시  |
| Selected | 선택 스타일 표시        |
| Open     | Dropdown Menu 노출 |
| Keyboard | 방향키 탐색 지원        |

---

## Style Preview UX

스타일 선택 시 Preview 자동 변경

예시:

```text id="ndm0mc"
Cyberpunk 선택
→ 네온 미래도시 스타일 예시 표시
```

---

## 생성 옵션

### Ratio 선택

* 1:1
* 16:9
* 9:16

---

### 생성 개수 선택

Stepper 형태 사용

예시:

* 1~4장 생성

---

## Generate 버튼

### 활성 조건

* Prompt 입력 완료
* Style 선택 완료

---

## 버튼 상태

| 상태       | 설명      |
| -------- | ------- |
| Disabled | 입력 부족   |
| Active   | 생성 가능   |
| Loading  | 생성 진행 중 |

---

# 5-4. 이미지 생성 로딩 UX

## 목적

생성 대기 시간을 몰입형 경험으로 전환

---

## 로딩 위치

화면 중앙 Overlay 방식 사용

배경:

* Dark Blur 처리

중앙 요소:

* AI Animation
* Progress
* 스타일 정보
* 상태 메시지

---

## 로딩 예시

```text id="l1v8fr"
Generating Artwork...

Style: Cyberpunk
Progress: 65%
```

---

## 로딩 애니메이션 가이드

| 타입            | 설명          |
| ------------- | ----------- |
| Pulse         | 생성 흐름 표현    |
| Gradient Flow | AI 처리 느낌    |
| Shimmer       | 이미지 생성 중 표현 |

---

## Overlay UX 규칙

| 항목        | 규칙            |
| --------- | ------------- |
| Dismiss   | 생성 중 닫기 불가    |
| Animation | Fade In 300ms |
| Progress  | 실시간 갱신 권장     |

---

# 5-5. 생성 결과 화면

## 목적

생성 결과 저장 및 공유 유도

## 주요 구성

* 생성 이미지 Grid
* Save 버튼
* Share 버튼
* Regenerate 버튼

---

## 결과 메타데이터

각 카드에 표시:

* 스타일 정보
* 비율
* 생성 시간

---

## 추가 액션

| 액션               | 설명              |
| ---------------- | --------------- |
| Reuse Style      | 동일 스타일 재사용      |
| Generate Similar | 유사 결과 생성        |
| Edit Prompt      | Prompt 수정 후 재생성 |

---

# 5-6. 개인 갤러리 화면

## 목적

생성 이미지 관리

## 주요 구성

탭:

* 전체
* 공개
* 비공개

정렬:

* 최신순
* 오래된순

콘텐츠:

* 반응형 이미지 Grid

상태:

* 🌍 Public
* 🔒 Private

---

## UX 포인트

* 빠른 공개 전환
* Infinite Scroll
* 카드 중심 탐색

---

# 5-7. 이미지 상세 화면

## 목적

작품 감상 및 프롬프트 탐색

## 주요 구성

상단:

* 뒤로가기
* 좋아요 버튼
* 좋아요 수

메인:

* 대형 이미지

메타데이터:

* 작성자
* Prompt
* Style
* Ratio
* 생성일

액션:

* Copy Prompt
* Generate Similar

---

## UX 포인트

* 이미지 Full Width
* Prompt 재활용 강조
* 재창작 흐름 연결

---

# 5-8. 프로필 화면

## 목적

크리에이터 공개 작품 관리

## 주요 구성

* 프로필 이미지
* 닉네임
* 소개
* 업로드 수
* 좋아요 수

하단:

* 공개 작품 Grid

---

# 6. 반응형 디자인 가이드

---

# 디바이스 기준

| 디바이스    | 기준         |
| ------- | ---------- |
| Mobile  | ~767px     |
| Tablet  | 768~1023px |
| Desktop | 1024px~    |

---

# 반응형 카드 규칙

| 항목     | 규칙              |
| ------ | --------------- |
| Width  | Auto Responsive |
| Height | 이미지 비율 유지       |
| Gap    | 디바이스별 유동        |
| Radius | 16px 유지         |

---

# 모바일 UX 전략

* Bottom Navigation 사용
* Thumb Zone 고려
* Tap 기반 인터랙션
* Hover 제거

---

# 하단 네비게이션

포함 탭:

* Home
* Create
* Gallery
* Profile

---

# 7. UI 컴포넌트 가이드

---

# Button

## 종류

| 타입        | 설명     |
| --------- | ------ |
| Primary   | 주요 CTA |
| Secondary | 보조 액션  |
| Ghost     | 최소 강조  |
| Danger    | 삭제     |

---

## 상태

| 상태       | 디자인            |
| -------- | -------------- |
| Default  | Primary Color  |
| Hover    | Brightness +5% |
| Active   | Scale 0.98     |
| Disabled | Opacity 40%    |
| Loading  | Spinner 표시     |

---

# ResponsiveImageCard

## 포함 요소

* 이미지
* 작성자
* 좋아요 수
* 공개 여부

---

## 인터랙션

Desktop:

* Hover 확대
* Shadow 강조

Mobile:

* Tap 중심
* 터치 영역 확대

---

# StyleDropdown

## 구성 요소

* Label
* Selected Value
* Dropdown Icon
* Option List

---

# GenerationLoadingOverlay

## 포함 요소

* 중앙 Animation
* 상태 메시지
* Progress
* Background Blur

---

# 8. 인터랙션 및 애니메이션

---

# 인터랙션 원칙

| 원칙                 | 설명       |
| ------------------ | -------- |
| Immediate Feedback | 즉각 반응    |
| Soft Motion        | 부드러운 전환  |
| Delight            | 생성 경험 강화 |

---

# 애니메이션 규칙

| 요소       | 효과              |
| -------- | --------------- |
| 페이지 이동   | Fade + Slide    |
| 카드 Hover | Elevation       |
| Modal    | Scale + Fade    |
| 로딩       | Pulse + Shimmer |

---

# 9. 비주얼 스타일 가이드

---

# 컬러 시스템

| 역할         | 색상      |
| ---------- | ------- |
| Primary    | #7C5CFF |
| Background | #0F1115 |
| Surface    | #1A1D24 |
| Border     | #2A2F3A |

---

# 상태 색상

| 상태      | 색상      |
| ------- | ------- |
| Success | #22C55E |
| Error   | #EF4444 |
| Warning | #F59E0B |

---

# 타이포그래피

## 추천 폰트

* Pretendard
* Inter

---

## 텍스트 계층

| 타입      | 크기   |
| ------- | ---- |
| H1      | 40px |
| H2      | 32px |
| H3      | 24px |
| Body    | 16px |
| Caption | 14px |

---

# 아이콘 스타일

* Outline 기반
* Rounded Edge
* Minimal Style

---

# 10. 접근성(A11y)

| 항목                  | 가이드         |
| ------------------- | ----------- |
| 대비                  | WCAG AA 이상  |
| Keyboard Navigation | 지원          |
| aria-label          | 제공          |
| 최소 폰트               | 14px        |
| 상태 전달               | 색상 단독 사용 금지 |

---

# 11. MVP 우선순위

PRD 기준 MVP 범위: 

## P0

* 메인 피드
* 이미지 생성
* 생성 결과

## P1

* 갤러리
* 이미지 상세

## P2

* 프로필

---

# 12. 개발 협업 포인트

| 항목              | 협업 내용  |
| --------------- | ------ |
| Masonry Layout  | 성능 최적화 |
| Infinite Scroll | 캐싱 전략  |
| Style Metadata  | 구조 정의  |
| 생성 Polling      | API 설계 |
| Lazy Loading    | UX 최적화 |

---

# 13. 최종 UX 방향성

CanvasHub는 단순한 AI 생성 툴이 아니라:

```text id="o91d7r"
스타일 탐색
→ 이미지 생성
→ 결과 감상
→ 공유
→ 영감 탐색
→ 재창작
```

이 반복되는 창작 커뮤니티 경험을 제공하는 플랫폼으로 설계한다.
