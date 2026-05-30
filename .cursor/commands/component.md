# 컴포넌트 생성

요청한 React 컴포넌트를 이 프로젝트 컨벤션에 맞게 생성한다.

## 규칙
- **TypeScript** 필수. props 타입은 인터페이스로 정의하고 이름 앞에 `I` 접두사를 붙인다. (예: `IButtonProps`)
- 여러 곳에서 재사용되는 타입/인터페이스는 `types/index.ts`에 정의한다. 해당 컴포넌트 전용 props 타입은 컴포넌트 파일 상단에 둬도 된다.
- **UI 요소는 ShadCN 컴포넌트(`components/ui/*`)를 우선 사용**한다. 없으면 ShadCN 방식으로 새로 추가한다.
- 스타일링은 **Tailwind CSS** + `cn()` 유틸(`lib/utils` 또는 `utils`)을 사용한다.
- 클라이언트 상호작용(상태, 이벤트)이 필요하면 파일 최상단에 `"use client"`를 명시한다. 불필요하면 서버 컴포넌트로 둔다.
- 배치 위치:
  - 여러 페이지에서 재사용 → `components/`
  - 공통 UI(ShadCN) → `components/ui/`
  - 특정 페이지 전용 → 해당 `app/<page>/` 폴더 안
- 전역 상태가 필요하면 **Zustand**, 폼은 **react-hook-form + zod**를 사용한다.

## 진행 방식
1. 컴포넌트의 위치와 이름을 컨벤션에 맞게 결정한다.
2. props 인터페이스를 정의한다.
3. 구현 후 `npm run lint`로 린트 오류가 없는지 확인하고, 있으면 수정한다.
