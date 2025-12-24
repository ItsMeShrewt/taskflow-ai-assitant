import { AlertDialogCustom } from '@/components/alert-dialog-custom';
import { useAlertStore } from '@/hooks/use-alert';

export function AlertProvider() {
  const { open, title, description, type, confirmText, cancelText, showCancel, onConfirm, onCancel, hideAlert } =
    useAlertStore();

  return (
    <AlertDialogCustom
      open={open}
      onOpenChange={hideAlert}
      title={title}
      description={description}
      type={type}
      confirmText={confirmText}
      cancelText={cancelText}
      showCancel={showCancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
