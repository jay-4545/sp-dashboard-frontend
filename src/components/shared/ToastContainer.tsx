'use client';

import { Snackbar, Alert } from '@mui/material';
import { useToastStore } from '@/store/toastStore';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const toast = toasts[0];

  if (!toast) return null;

  return (
    <Snackbar
      open
      autoHideDuration={4000}
      onClose={() => removeToast(toast.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => removeToast(toast.id)}
        severity={toast.type === 'error' ? 'error' : toast.type === 'success' ? 'success' : 'info'}
        variant="filled"
        sx={{ width: '100%', minWidth: 280 }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
