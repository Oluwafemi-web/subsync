import type { TSignupNombaAccountValues } from "@/lib/auth/schemas";

export interface ISignupStepNombaAccountProps {
  onBack: () => void;
  onSubmit: (values: TSignupNombaAccountValues) => void;
  isSubmitting: boolean;
}
