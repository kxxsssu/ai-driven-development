"use client";

import { useEffect, useState } from "react";

/**
 * localStorage 기반 persist 스토어는 서버 렌더와 클라이언트 첫 렌더가
 * 달라 hydration 경고가 발생할 수 있다. 마운트 이후에만 스토어 값을
 * 반영하도록 가드 용도로 사용한다.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
