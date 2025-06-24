"use client"

import React, { useState, useEffect } from "react"
import { cn } from "../lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
}

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  warning:
    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2",
        toastStyles[toast.type],
      )}
    >
      <span className="text-xl flex-shrink-0">{toastIcons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium">{typeof toast.title === 'string' ? toast.title : JSON.stringify(toast.title)}</h4>
        {toast.message && <p className="text-sm mt-1 opacity-90">{typeof toast.message === 'string' ? toast.message : JSON.stringify(toast.message)}</p>}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-lg opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    // title, message에 객체가 들어오면 문자열로 변환 또는 오류 메시지로 대체
    let safeTitle: string = ""
    let safeMessage: string | undefined = undefined
    if (typeof toast.title === "string") {
      safeTitle = toast.title
    } else if (toast.title !== undefined) {
      safeTitle = typeof toast.title === "object" ? JSON.stringify(toast.title) : String(toast.title)
    } else {
      safeTitle = "오류 발생"
    }
    if (toast.message !== undefined) {
      if (typeof toast.message === "string") {
        safeMessage = toast.message
      } else if (typeof toast.message === "object") {
        safeMessage = JSON.stringify(toast.message)
      } else {
        safeMessage = String(toast.message)
      }
    }
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id, title: safeTitle, message: safeMessage }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (title: string | React.ReactNode, message?: string | React.ReactNode) => {
    addToast({
      type: "success",
      title: React.isValidElement(title)
        ? JSON.stringify(title)
        : typeof title === "object"
        ? JSON.stringify(title)
        : String(title),
      message:
        message === undefined
          ? undefined
          : React.isValidElement(message)
          ? JSON.stringify(message)
          : typeof message === "object"
          ? JSON.stringify(message)
          : String(message),
    });
  };

  const error = (title: string | React.ReactNode, message?: string | React.ReactNode) => {
    addToast({
      type: "error",
      title: React.isValidElement(title)
        ? JSON.stringify(title)
        : typeof title === "object"
        ? JSON.stringify(title)
        : String(title),
      message:
        message === undefined
          ? undefined
          : React.isValidElement(message)
          ? JSON.stringify(message)
          : typeof message === "object"
          ? JSON.stringify(message)
          : String(message),
    });
  };

  const warning = (title: string | React.ReactNode, message?: string | React.ReactNode) => {
    addToast({
      type: "warning",
      title: React.isValidElement(title)
        ? JSON.stringify(title)
        : typeof title === "object"
        ? JSON.stringify(title)
        : String(title),
      message:
        message === undefined
          ? undefined
          : React.isValidElement(message)
          ? JSON.stringify(message)
          : typeof message === "object"
          ? JSON.stringify(message)
          : String(message),
    });
  };

  const info = (title: string | React.ReactNode, message?: string | React.ReactNode) => {
    addToast({
      type: "info",
      title: React.isValidElement(title)
        ? JSON.stringify(title)
        : typeof title === "object"
        ? JSON.stringify(title)
        : String(title),
      message:
        message === undefined
          ? undefined
          : React.isValidElement(message)
          ? JSON.stringify(message)
          : typeof message === "object"
          ? JSON.stringify(message)
          : String(message),
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}

// default export: show 메서드 제공
const Toast = {
  show: (options: { type?: ToastType; title?: string; message: string; duration?: number }) => {
    // 간단한 브라우저 alert 대체 (실제 앱에서는 전역 상태/컨텍스트로 연결 필요)
    if (typeof window !== 'undefined') {
      window.alert(options.message);
    }
  },
};
export default Toast;
