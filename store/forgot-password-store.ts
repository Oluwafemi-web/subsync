import { create } from "zustand";
import type {
  TForgotPasswordEmailValues,
  TForgotPasswordOtpValues,
} from "@/lib/auth/schemas";

export type TForgotPasswordStep = 1 | 2 | 3;

interface IForgotPasswordState {
  step: TForgotPasswordStep;
  email: TForgotPasswordEmailValues;
  otp: TForgotPasswordOtpValues;
  resetToken: string | null;
  devOtp: string | null;
  setStep: (step: TForgotPasswordStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setEmail: (data: TForgotPasswordEmailValues) => void;
  setOtp: (data: TForgotPasswordOtpValues) => void;
  setResetToken: (token: string) => void;
  setDevOtp: (otp: string | null) => void;
  reset: () => void;
}

const defaultEmail: TForgotPasswordEmailValues = { email: "" };
const defaultOtp: TForgotPasswordOtpValues = { otp: "" };

export const useForgotPasswordStore = create<IForgotPasswordState>((set, get) => ({
  step: 1,
  email: defaultEmail,
  otp: defaultOtp,
  resetToken: null,
  devOtp: null,
  setStep: (step) => set({ step }),
  nextStep: () => {
    const current = get().step;
    if (current < 3) set({ step: (current + 1) as TForgotPasswordStep });
  },
  prevStep: () => {
    const current = get().step;
    if (current > 1) set({ step: (current - 1) as TForgotPasswordStep });
  },
  setEmail: (data) => set({ email: data }),
  setOtp: (data) => set({ otp: data }),
  setResetToken: (token) => set({ resetToken: token }),
  setDevOtp: (otp) => set({ devOtp: otp }),
  reset: () =>
    set({
      step: 1,
      email: defaultEmail,
      otp: defaultOtp,
      resetToken: null,
      devOtp: null,
    }),
}));
