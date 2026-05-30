# API Route Handler 생성

요청한 API 엔드포인트를 App Router의 Route Handler로 구현한다.

## 규칙
- **모든 API 엔드포인트는 Route Handler**(`app/api/.../route.ts`)로 구현한다. Server Action은 단순 폼 제출에만 사용한다.
- DB 작업, 외부 API 호출, 인증 등 복잡한 서버 로직은 반드시 Route Handler에서 처리한다.
- DB 접근은 **Drizzle ORM**(`db/schema.ts`, `db/index.ts`)을 사용한다.
- 요청/응답 타입은 `types/index.ts`에 `I` 접두사 인터페이스로 정의한다.
- 입력값 검증은 **zod**로 수행한다.
- 표준 `Request`/`NextResponse`를 사용하고, HTTP 메서드별로 `GET`, `POST`, `PUT`, `DELETE` 함수를 export 한다.
- 에러는 try/catch로 처리하고 적절한 상태 코드(400/401/404/500 등)와 JSON 에러 메시지를 반환한다.

## 진행 방식
1. 엔드포인트 경로와 메서드를 결정한다. (`app/api/<resource>/route.ts`)
2. zod 스키마로 입력 검증을 정의한다.
3. Drizzle로 데이터 작업을 구현하고 타입 안전한 응답을 반환한다.
4. `npm run lint`로 확인 후 오류를 수정한다.
