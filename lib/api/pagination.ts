import type { IApiMeta } from "@/lib/api/@types";
import type { IPaginatedResponse } from "@/types";

export function mapPaginatedResponse<T>(
  items: T[],
  meta: IApiMeta,
  fallbackPageSize: number
): IPaginatedResponse<T> {
  const page = meta.page ?? 1;
  const pageSize = meta.per_page ?? fallbackPageSize;
  const total = meta.total ?? items.length;

  return {
    data: items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
