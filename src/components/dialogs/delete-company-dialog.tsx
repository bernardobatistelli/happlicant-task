"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Company } from "@/types/company";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (company: Company) => Promise<void>;
}

export function DeleteCompanyDialog({
  company,
  open,
  onOpenChange,
  onConfirm,
}: DeleteCompanyDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!company) return;

    startTransition(async () => {
      await onConfirm(company);
      // Small delay to show the optimistic update before closing dialog
      await new Promise((resolve) => setTimeout(resolve, 300));
      onOpenChange(false);
    });
  };

  if (!company) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold text-foreground">
              {company.name}
            </span>{" "}
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
