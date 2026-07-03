import { create } from "zustand";
import type {
  TSignupAccountValues,
  TSignupApiCredentialsValues,
  TSignupNombaAccountValues,
} from "@/lib/auth/schemas";

export type TSignupStep = 1 | 2 | 3;

interface ISignupState {
  step: TSignupStep;
  account: TSignupAccountValues;
  apiCredentials: TSignupApiCredentialsValues;
  nombaAccount: TSignupNombaAccountValues;
  setStep: (step: TSignupStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAccount: (data: TSignupAccountValues) => void;
  setApiCredentials: (data: TSignupApiCredentialsValues) => void;
  setNombaAccount: (data: TSignupNombaAccountValues) => void;
  reset: () => void;
}

const defaultAccount: TSignupAccountValues = {
  email: "",
  password: "",
  name: "",
};

const defaultApiCredentials: TSignupApiCredentialsValues = {
  nomba_client_id: "",
  nomba_client_secret: "",
};

const defaultNombaAccount: TSignupNombaAccountValues = {
  nomba_account_id: "",
  nomba_sub_account_id: "",
  nomba_env: "sandbox",
  nomba_webhook_secret: "",
};

export const useSignupStore = create<ISignupState>((set, get) => ({
  step: 1,
  account: defaultAccount,
  apiCredentials: defaultApiCredentials,
  nombaAccount: defaultNombaAccount,
  setStep: (step) => set({ step }),
  nextStep: () => {
    const current = get().step;
    if (current < 3) set({ step: (current + 1) as TSignupStep });
  },
  prevStep: () => {
    const current = get().step;
    if (current > 1) set({ step: (current - 1) as TSignupStep });
  },
  setAccount: (data) => set({ account: data }),
  setApiCredentials: (data) => set({ apiCredentials: data }),
  setNombaAccount: (data) => set({ nombaAccount: data }),
  reset: () =>
    set({
      step: 1,
      account: defaultAccount,
      apiCredentials: defaultApiCredentials,
      nombaAccount: defaultNombaAccount,
    }),
}));
