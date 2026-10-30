import { toast } from "sonner";

/**
 * ReUI c-sonner-13: Inverted dark success toast with icon and description
 */
export function showSuccessToast(title: string, description?: string) {
  toast.success(title, {
    description,
    duration: 4000,
  });
}

/**
 * ReUI c-sonner-7: Promise toast with live loading and completion
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
  }
) {
  return toast.promise(promise, messages);
}

/**
 * ReUI c-sonner-8: Action / Confirm / Deletion toast
 */
export function showDeleteConfirmToast(
  title: string,
  onConfirm: () => void,
  description?: string
) {
  toast(title, {
    description: description || "This action cannot be undone.",
    action: {
      label: "Confirm Delete",
      onClick: onConfirm,
    },
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
    duration: 6000,
  });
}
