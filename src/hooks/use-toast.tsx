"use client";

import * as React from "react";

// Toast 타입 정의
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    // title, message에 객체가 들어오면 문자열로 변환 또는 오류 메시지로 대체
    let safeTitle: string = "";
    let safeMessage: string | undefined = undefined;
    if (typeof toast.title === "string") {
      safeTitle = toast.title;
    } else if (toast.title !== undefined) {
      safeTitle = typeof toast.title === "object" ? JSON.stringify(toast.title) : String(toast.title);
    } else {
      safeTitle = "오류 발생";
    }
    if (toast.message !== undefined) {
      if (typeof toast.message === "string") {
        safeMessage = toast.message;
      } else if (typeof toast.message === "object") {
        safeMessage = JSON.stringify(toast.message);
      } else {
        safeMessage = String(toast.message);
      }
    }
    setToasts((prev) => [
      ...prev,
      { ...toast, id: Math.random().toString(36).slice(2), title: safeTitle, message: safeMessage },
    ]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
