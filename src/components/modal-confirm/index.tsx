import { useEffect, useRef, useState, type ReactNode } from "react";
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

type ModalConfirmOptions = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
};

type ModalConfirmAPI = {
  show: (options: ModalConfirmOptions) => void;
};

type ModalConfirmProviderProps = {
  children: ReactNode;
};

type DialogState = {
  isOpen: boolean;
  isProcessing: boolean;
  options: ModalConfirmOptions;
};

const DEFAULT_OPTIONS: ModalConfirmOptions = {
  title: "",
  description: "",
  onConfirm: () => {},
  confirmText: "Delete",
  cancelText: "Cancel",
};

// Singleton ref untuk imperative API
const ModalConfirmRef: { current: ModalConfirmAPI | null } = { current: null };

export const ModalConfirm: ModalConfirmAPI = {
  show: (options: ModalConfirmOptions) => {
    if (!ModalConfirmRef.current) {
      throw new Error(
        "ModalConfirm not initialized. Make sure ModalConfirmProvider is mounted in your app."
      );
    }
    ModalConfirmRef.current.show(options);
  },
};

export function ModalConfirmProvider({ children }: ModalConfirmProviderProps) {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    isProcessing: false,
    options: DEFAULT_OPTIONS,
  });

  const apiRef = useRef<ModalConfirmAPI>({
    show: (newOptions: ModalConfirmOptions) => {
      setState({
        isOpen: true,
        isProcessing: false,
        options: {
          confirmText: "Delete",
          cancelText: "Cancel",
          ...newOptions,
        },
      });
    },
  });

  // Register API ref on mount
  useEffect(() => {
    ModalConfirmRef.current = apiRef.current;
  }, []);

  const handleClose = () => {
    if (state.isProcessing) return;
    setState((prev) => ({
      ...prev,
      isOpen: false,
      isProcessing: false,
    }));
  };

  const handleConfirm = async () => {
    setState((prev) => ({ ...prev, isProcessing: true }));
    try {
      await state.options.onConfirm();
      setState((prev) => ({
        ...prev,
        isOpen: false,
        isProcessing: false,
      }));
    } catch (error) {
      console.error("Confirm action failed:", error);
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <>
      {children}
      <AlertDialog onOpenChange={handleClose} open={state.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.options.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={state.isProcessing}>
              {state.options.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              disabled={state.isProcessing}
              onClick={() => void handleConfirm()}
            >
              {state.isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                state.options.confirmText
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export type { ModalConfirmOptions };
