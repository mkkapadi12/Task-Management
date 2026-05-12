import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DASHBOARD_ICONS } from "@/lib/icons/dashboard.icons";
import { cn } from "@/lib/utils";

const AlertDialog = ({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  isDestructive = false,
  isLoading = false,
  open,
  onOpenChange,
}) => {
  return (
    <ShadcnAlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              isDestructive &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            )}
          >
            {isLoading && (
              <DASHBOARD_ICONS.LOADER2
                size={14}
                className="mr-2 animate-spin"
              />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
};

export default AlertDialog;
