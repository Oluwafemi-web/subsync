export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

export const DEFAULT_PAGE_SIZE = 25;
