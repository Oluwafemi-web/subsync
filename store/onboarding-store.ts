import { create } from "zustand";
import type {
  TBusinessDetailsValues,
  TNombaCredentialsValues,
} from "@/lib/auth/schemas";

export type TOnboardingStep = 1 | 2;

interface IOnboardingState {
  step: TOnboardingStep;
  businessDetails: TBusinessDetailsValues;
  nombaCredentials: TNombaCredentialsValues;
  apiKey: string | null;
  nombaVerified: boolean;
  setStep: (step: TOnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBusinessDetails: (data: TBusinessDetailsValues) => void;
  setNombaCredentials: (data: TNombaCredentialsValues) => void;
  setApiKey: (key: string) => void;
  setNombaVerified: (verified: boolean) => void;
}

const defaultBusinessDetails: TBusinessDetailsValues = {
  name: "",
  email: "",
  website: "",
};

const defaultNombaCredentials: TNombaCredentialsValues = {
  accountId: "",
  clientId: "",
  clientSecret: "",
  subAccountId: "",
  env: "sandbox",
};

export const useOnboardingStore = create<IOnboardingState>((set, get) => ({
  step: 1,
  businessDetails: defaultBusinessDetails,
  nombaCredentials: defaultNombaCredentials,
  apiKey: null,
  nombaVerified: false,
  setStep: (step) => set({ step }),
  nextStep: () => {
    const current = get().step;
    if (current < 2) set({ step: (current + 1) as TOnboardingStep });
  },
  prevStep: () => {
    const current = get().step;
    if (current > 1) set({ step: (current - 1) as TOnboardingStep });
  },
  setBusinessDetails: (data) => set({ businessDetails: data }),
  setNombaCredentials: (data) => set({ nombaCredentials: data, nombaVerified: false }),
  setApiKey: (key) => set({ apiKey: key }),
  setNombaVerified: (verified) => set({ nombaVerified: verified }),
}));
