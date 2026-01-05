"use client";

import { Toaster, toast as hotToast } from "react-hot-toast";
import { createContext, useContext, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  loading: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const success = useCallback((message: string) => {
    hotToast.success(message, {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      style: {
        background: "#FFF",
        border: "1px solid #5B1A1A",
        borderRadius: "1rem",
        padding: "1rem",
        color: "#5B1A1A",
        fontWeight: "bold",
      },
    });
  }, []);

  const error = useCallback((message: string) => {
    hotToast.error(message, {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      style: {
        background: "#FFF",
        border: "1px solid #DC2626",
        borderRadius: "1rem",
        padding: "1rem",
        color: "#DC2626",
        fontWeight: "bold",
      },
    });
  }, []);

  const info = useCallback((message: string) => {
    hotToast(message, {
      icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
      style: {
        background: "#FFF",
        border: "1px solid #3B82F6",
        borderRadius: "1rem",
        padding: "1rem",
        color: "#3B82F6",
        fontWeight: "bold",
      },
    });
  }, []);

  const loading = useCallback((message: string) => {
    hotToast.loading(message, {
      icon: <Loader2 className="h-5 w-5 animate-spin text-brand-maroon" />,
      style: {
        background: "#FFF",
        border: "1px solid #5B1A1A",
        borderRadius: "1rem",
        padding: "1rem",
        color: "#5B1A1A",
        fontWeight: "bold",
      },
    });
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info, loading }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#FFF",
            color: "#5B1A1A",
            fontWeight: "bold",
          },
        }}
      />
    </ToastContext.Provider>
  );
}
