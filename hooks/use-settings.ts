import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  rotateApiKey,
  verifyNombaCredentials,
} from "@/lib/mock-api";
import { queryKeys } from "@/lib/query-keys";
import type { INombaCredentials } from "@/types";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: getSettings,
  });
}

export function useVerifyNombaCredentials() {
  return useMutation({
    mutationFn: (credentials: Pick<INombaCredentials, "accountId" | "clientId" | "clientSecret">) =>
      verifyNombaCredentials(credentials),
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rotateApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}
