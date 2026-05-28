# 로그인 Frontend 기능명세서

# 1. 페이지 구조

## 라우트 구조

```bash
app/
 ├── login/
 │   ├── page.tsx
 │   ├── LoginForm.tsx
 │   ├── LoginHeader.tsx
 │   └── LoginBackground.tsx
 │
 ├── register/
 │   ├── page.tsx
 │   ├── RegisterForm.tsx
 │   └── RegisterHeader.tsx
```

---

# 2. 로그인 페이지 명세

## 페이지 경로

```bash
/login
```

---

## 페이지 목적

* 기존 사용자 인증
* 세션 생성
* 메인 피드 진입

---

# 3. 로그인 화면 레이아웃

## 전체 구조

```text
┌────────────────────────────┐
│                            │
│        CanvasHub           │
│                            │
│   ┌──────────────────┐     │
│   │ 이메일 입력       │     │
│   │ 비밀번호 입력     │     │
│   │                  │     │
│   │ 로그인 버튼       │     │
│   │                  │     │
│   │ 회원가입 링크     │     │
│   └──────────────────┘     │
│                            │
└────────────────────────────┘
```

---

# 4. LoginBackground 명세

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

# 5. LoginHeader 명세

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

## UX 규칙

* 중앙 정렬
* Card 상단 배치
* 여백 24px 유지

---

# 6. LoginForm 명세

## 파일 위치

```bash
app/login/LoginForm.tsx
```

---

## 목적

사용자 로그인 처리

---

# 7. Form UI 구성

## 입력 요소

| 요소      | 설명       |
| ------- | -------- |
| 이메일 입력  | 이메일 주소   |
| 비밀번호 입력 | 사용자 비밀번호 |
| 로그인 버튼  | 로그인 요청   |
| 회원가입 링크 | 회원가입 이동  |

---

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Card   | ShadCN |
| Input  | ShadCN |
| Label  | ShadCN |
| Button | ShadCN |
| Form   | ShadCN |
| Toast  | ShadCN |

---

# 8. Layout 규칙

| 항목            | 값     |
| ------------- | ----- |
| Form Width    | 420px |
| Input Height  | 48px  |
| Button Height | 48px  |
| Border Radius | 16px  |
| Gap           | 16px  |

---

# 9. Validation 규칙

## 이메일

| 조건     | 규칙        |
| ------ | --------- |
| 필수 입력  | true      |
| 이메일 형식 | RFC 기본 형식 |
| 최대 길이  | 255       |

---

## 비밀번호

| 조건    | 규칙   |
| ----- | ---- |
| 필수 입력 | true |
| 최소 길이 | 8    |
| 최대 길이 | 50   |

---

# 10. 버튼 상태

| 상태       | 설명       |
| -------- | -------- |
| Default  | 클릭 가능    |
| Disabled | 입력 부족    |
| Loading  | 로그인 요청 중 |

---

# 11. 사용자 인터랙션

## 로그인 흐름

```text
이메일 입력
→ 비밀번호 입력
→ 로그인 버튼 클릭
→ 인증 요청
→ 세션 생성
→ 메인 피드 이동
```

---

## 회원가입 이동 흐름

```text
회원가입 클릭
→ /register 이동
```

---

# 12. 로그인 실패 UX

## 실패 케이스

| 상황      | 메시지             |
| ------- | --------------- |
| 이메일 없음  | 가입되지 않은 계정입니다   |
| 비밀번호 오류 | 비밀번호가 올바르지 않습니다 |
| 서버 오류   | 잠시 후 다시 시도해주세요  |

---

## UX 처리

| 항목       | 처리          |
| -------- | ----------- |
| 오류 표시    | Toast       |
| Focus 유지 | 이메일/비밀번호    |
| 비밀번호 초기화 | 적용          |
| 중복 요청 방지 | 버튼 Disabled |

---

# 13. 접근성(A11y)

| 항목                  | 적용 |
| ------------------- | -- |
| aria-label          | 제공 |
| keyboard navigation | 지원 |
| enter submit        | 지원 |
| focus visible       | 지원 |

---

# 14. 상태 관리

## 상태 구조

```ts
loginState = {
  email,
  password,
  loading,
  error
}
```

---

## 권장 방식

| 목적         | 방식                     |
| ---------- | ---------------------- |
| Form 관리    | React Hook Form        |
| Validation | Zod                    |
| API 요청     | Server Action 또는 Fetch |

---

# 15. 로그인 API 연동 명세

## 요청

```http
POST /api/auth/login
```

---

## Request Body

```ts
{
  email: string
  password: string
}
```

---

## 성공 응답

```ts
{
  success: true,
  user: {
    id: string,
    name: string,
    email: string
  }
}
```

---

## 실패 응답

```ts
{
  success: false,
  error: string
}
```

---

# 회원가입 Frontend 기능명세서

# 1. 페이지 경로

```bash
/register
```

---

# 2. RegisterForm 명세

## 파일 위치

```bash
app/register/RegisterForm.tsx
```

---

## 입력 요소

| 요소      | 설명       |
| ------- | -------- |
| 닉네임     | 사용자 이름   |
| 이메일     | 로그인 이메일  |
| 비밀번호    | 계정 비밀번호  |
| 비밀번호 확인 | 비밀번호 재입력 |
| 회원가입 버튼 | 계정 생성    |

---

## 사용 컴포넌트

| 컴포넌트   | 타입     |
| ------ | ------ |
| Card   | ShadCN |
| Input  | ShadCN |
| Label  | ShadCN |
| Button | ShadCN |
| Form   | ShadCN |

---

# 3. 회원가입 Validation

## 닉네임

| 조건    | 규칙 |
| ----- | -- |
| 최소 길이 | 2  |
| 최대 길이 | 20 |
| trim  | 적용 |

---

## 이메일

| 조건     | 규칙   |
| ------ | ---- |
| 중복 불가  | true |
| 이메일 형식 | 검증   |

---

## 비밀번호

| 조건    | 규칙   |
| ----- | ---- |
| 최소 길이 | 8    |
| 영문 포함 | true |
| 숫자 포함 | true |

---

# 4. 회원가입 흐름

```text
회원정보 입력
→ 회원가입 요청
→ 사용자 생성
→ 세션 생성
→ 메인 피드 이동
```

---

# 로그인/회원가입 Backend 기능명세서

# 1. API 구조

## 파일 구조

```bash
app/
 └── api/
     └── auth/
         ├── login/
         │   └── route.ts
         ├── register/
         │   └── route.ts
         ├── logout/
         │   └── route.ts
         └── session/
             └── route.ts
```

---

# 2. 로그인 API

## Endpoint

```http
POST /api/auth/login
```

---

## 처리 로직

```text
1. 이메일 조회
2. 비밀번호 비교
3. 세션 생성
4. HTTP Only Cookie 저장
5. 사용자 정보 반환
```

---

## 인증 방식

```text
Cookie Session 기반 인증
```

---

# 3. 회원가입 API

## Endpoint

```http
POST /api/auth/register
```

---

## Request Body

```ts
{
  name: string
  email: string
  password: string
}
```

---

## 처리 로직

```text
1. 이메일 중복 확인
2. 비밀번호 Hash 처리
3. 사용자 생성
4. 세션 생성
5. Cookie 저장
```

---

# 4. 로그아웃 API

## Endpoint

```http
POST /api/auth/logout
```

---

## 처리 로직

```text
세션 제거
Cookie 삭제
```

---

# 5. 세션 조회 API

## Endpoint

```http
GET /api/auth/session
```

---

## 목적

* 로그인 상태 확인
* 사용자 정보 조회
* 보호 라우트 검증

---

# 6. DB 설계

## 파일 위치

```bash
db/schema.ts
```

---

# users 테이블

| 컬럼           | 타입            |
| ------------ | ------------- |
| id           | uuid          |
| email        | text          |
| passwordHash | text          |
| name         | text          |
| avatarUrl    | text nullable |
| createdAt    | timestamp     |

---

# sessions 테이블

| 컬럼        | 타입        |
| --------- | --------- |
| id        | uuid      |
| userId    | uuid      |
| expiresAt | timestamp |
| createdAt | timestamp |

---

# 7. 암호화 정책

| 항목            | 방식     |
| ------------- | ------ |
| Password Hash | bcrypt |
| Salt Round    | 10 이상  |

---

# 8. Middleware 인증 처리

## 파일 위치

```bash
middleware.ts
```

---

## 보호 라우트

| 경로       | 인증 필요 |
| -------- | ----- |
| /create  | 필요    |
| /gallery | 필요    |
| /profile | 필요    |

---

## 인증 흐름

```text
세션 확인
→ 인증 여부 확인
→ 미인증 시 /login redirect
```

---

# 9. Backend 테스트 항목

## 인증 테스트

* 로그인 성공
* 로그인 실패
* 회원가입 성공
* 이메일 중복 검증

---

## 세션 테스트

* 로그인 유지 확인
* 로그아웃 처리 확인
* Cookie 저장 확인

---

## 보안 테스트

* Password Hash 저장 확인
* HTTP Only Cookie 확인
* 미인증 접근 차단 확인
