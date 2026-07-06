"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/checkout";
import type { IOneTimeSecretDialogProps } from "./@types";

export function OneTimeSecretDialog({
  open,
  onOpenChange,
  title,
  description,
  secret,
  label = "Secret",
}: IOneTimeSecretDialogProps) {
  async function handleCopy() {
    await copyToClipboard(secret);
    toast.success("Copied to clipboard");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex gap-2">
            <Input value={secret} readOnly className="font-mono text-xs" />
            <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            I&apos;ve saved it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
