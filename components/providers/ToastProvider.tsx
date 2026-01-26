"use client";

import { Toaster, toast as hotToast } from "react-hot-toast";
import { createContext, useContext, ReactNode } from "react";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  loading: (message: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const contextValue: ToastContextType = {
    success: (message: string) => hotToast.success(message),
    error: (message: string) => hotToast.error(message),
    info: (message: string) => hotToast(message),
    loading: (message: string) => hotToast.loading(message),
    promise: (promise, messages) => hotToast.promise(promise, messages),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster position="top-right" />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}