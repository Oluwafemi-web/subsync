export interface ICheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface ICheckoutSuccessState {
  checkoutUrl: string;
  subscriptionId: string;
  customerEmail?: string;
}
