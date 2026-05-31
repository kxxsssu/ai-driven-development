import Replicate from "replicate";

export const FLUX_SCHNELL_MODEL = "black-forest-labs/flux-schnell";

export function getReplicateApiToken(): string | undefined {
  return process.env.REPLICATE_API_TOKEN;
}

export function getReplicateClient(): Replicate {
  const token = getReplicateApiToken();
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }

  return new Replicate({ auth: token });
}
