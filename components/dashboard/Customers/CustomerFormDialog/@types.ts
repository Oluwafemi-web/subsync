export interface ICustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  customerId?: string;
  defaultValues?: {
    name: string;
    email: string;
    phone?: string;
    externalId?: string;
  };
  onSuccess?: () => void;
}
