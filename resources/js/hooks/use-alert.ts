import { create } from 'zustand';

interface AlertState {
  open: boolean;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertStore extends AlertState {
  showAlert: (config: Partial<AlertState>) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  open: false,
  title: '',
  description: '',
  type: 'info',
  confirmText: 'OK',
  cancelText: 'Cancel',
  showCancel: false,
  onConfirm: undefined,
  onCancel: undefined,
  showAlert: (config) =>
    set({
      open: true,
      title: config.title || '',
      description: config.description || '',
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancel',
      showCancel: config.showCancel || false,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    }),
  hideAlert: () => set({ open: false }),
}));

// Convenience functions
export const alert = {
  success: (message: string, onConfirm?: () => void) => {
    useAlertStore.getState().showAlert({
      title: 'Success',
      description: message,
      type: 'success',
      confirmText: 'Great!',
      onConfirm,
    });
  },
  error: (message: string, onConfirm?: () => void) => {
    useAlertStore.getState().showAlert({
      title: 'Error',
      description: message,
      type: 'error',
      confirmText: 'OK',
      onConfirm,
    });
  },
  warning: (message: string, onConfirm?: () => void) => {
    useAlertStore.getState().showAlert({
      title: 'Warning',
      description: message,
      type: 'warning',
      confirmText: 'Understood',
      onConfirm,
    });
  },
  info: (message: string, onConfirm?: () => void) => {
    useAlertStore.getState().showAlert({
      title: 'Information',
      description: message,
      type: 'info',
      confirmText: 'OK',
      onConfirm,
    });
  },
  confirm: (config: {
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => {
    useAlertStore.getState().showAlert({
      title: config.title,
      description: config.message,
      type: 'warning',
      confirmText: config.confirmLabel || 'Confirm',
      cancelText: config.cancelLabel || 'Cancel',
      showCancel: true,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    });
  },
};
