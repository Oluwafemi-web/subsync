export interface IOneTimeSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  secret: string;
  label?: string;
}
