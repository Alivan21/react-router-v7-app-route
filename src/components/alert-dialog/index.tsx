import { OctagonAlert } from "lucide-react";
import { ReactNode } from "react";
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
import { buttonVariants } from "@/components/ui/button";

type AlertConfirmDialogProps = {
  isDestructive?: boolean;
  title?: string;
  description?: string;
  continueText?: string;
  cancelText?: string;
  onContinue?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
};

export default function AlertConfirmDialog({
  isDestructive = false,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  continueText = "Continue",
  cancelText = "Cancel",
  onContinue,
  open,
  onOpenChange,
  icon = <OctagonAlert className="text-destructive size-7" />,
}: AlertConfirmDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex-row items-start gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex flex-col gap-1">
            <AlertDialogTitle className="text-left text-lg font-medium">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-start">{description}</AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 sm:justify-end">
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: isDestructive ? "destructive" : "default" })}
            onClick={onContinue}
          >
            {continueText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
