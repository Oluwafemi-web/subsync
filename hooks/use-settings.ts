import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  rotateApiKey,
  updateGeneralSettings,
  updateNombaSettings,
  verifyNombaCredentials,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type {
  TGeneralSettingsValues,
  TNombaSettingsValues,
} from "@/lib/schemas/dashboard";
import type { INombaCredentials } from "@/types";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: getSettings,
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TGeneralSettingsValues) =>
      updateGeneralSettings(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useUpdateNombaSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TNombaSettingsValues) => updateNombaSettings(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useVerifyNombaCredentials() {
  return useMutation({
    mutationFn: (credentials: Pick<
      INombaCredentials,
      "accountId" | "clientId" | "clientSecret"
    >) => verifyNombaCredentials(credentials),
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
