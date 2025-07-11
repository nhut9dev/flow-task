'use client';

import * as React from 'react';

import { Toast, ToastProps } from './toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  const showToast = React.useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2 w-[320px]">
        {toasts.map(({ id, ...toast }) => (
          <Toast key={id} {...toast} onClose={() => removeToast(id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
