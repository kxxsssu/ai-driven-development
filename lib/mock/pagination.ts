export interface IPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// cursor는 다음 페이지의 시작 인덱스를 문자열로 표현한다.
// 잘못된 값이면 호출부에서 400으로 응답할 수 있도록 INVALID_CURSOR를 throw한다.
export function paginate<T>(
  items: T[],
  cursor: string | undefined,
  limit: number
): IPaginatedResult<T> {
  const startIndex = cursor ? parseInt(cursor, 10) : 0;

  if (Number.isNaN(startIndex) || startIndex < 0) {
    throw new Error("INVALID_CURSOR");
  }

  const pageItems = items.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + limit;
  const hasNextPage = nextIndex < items.length;

  return {
    items: pageItems,
    nextCursor: hasNextPage ? String(nextIndex) : null,
    hasNextPage,
  };
}
