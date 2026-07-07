export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

export function getNgrokSkipHeaders(): Record<string, string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  if (/ngrok/i.test(baseUrl)) {
    return { "ngrok-skip-browser-warning": "true" };
  }

  return {};
}

export const DEFAULT_PAGE_SIZE = 25;
