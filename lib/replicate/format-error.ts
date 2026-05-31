interface IReplicateErrorBody {
  title?: string;
  detail?: string;
}

function parseReplicateErrorBody(message: string): IReplicateErrorBody | null {
  const jsonMatch = message.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]) as IReplicateErrorBody;
  } catch {
    return null;
  }
}

function isReplicateApiError(
  error: unknown
): error is Error & { response?: Response } {
  return (
    error instanceof Error &&
    error.name === "ApiError" &&
    "response" in error
  );
}

export function formatReplicateError(error: unknown): {
  status: number;
  error: string;
  message: string;
} {
  if (!isReplicateApiError(error)) {
    return {
      status: 502,
      error: "GENERATION_FAILED",
      message:
        error instanceof Error
          ? error.message
          : "이미지 생성 요청에 실패했습니다.",
    };
  }

  const status = error.response?.status ?? 502;
  const body = parseReplicateErrorBody(error.message);

  if (status === 402) {
    return {
      status: 402,
      error: "INSUFFICIENT_CREDIT",
      message:
        "Replicate 계정 크레딧이 부족합니다. billing 페이지에서 충전한 뒤 몇 분 후 다시 시도해주세요.",
    };
  }

  if (status === 401) {
    return {
      status: 401,
      error: "INVALID_REPLICATE_TOKEN",
      message: "Replicate API 토큰이 유효하지 않습니다. 토큰을 확인해주세요.",
    };
  }

  if (status === 429) {
    return {
      status: 429,
      error: "RATE_LIMITED",
      message: "Replicate 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  return {
    status: status >= 400 && status < 600 ? status : 502,
    error: "GENERATION_FAILED",
    message:
      body?.detail ??
      body?.title ??
      "이미지 생성 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
  };
}
