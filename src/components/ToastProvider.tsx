"use client";
import * as React from "react";
import { ToastProvider as InnerToastProvider, useToast } from "@/hooks/use-toast";

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`rounded px-4 py-2 shadow bg-white border-l-4 border-${toast.type}-500`}>
          <div className="font-bold">{toast.title}</div>
          {toast.message && <div>{toast.message}</div>}
          <button onClick={() => removeToast(toast.id)} className="text-xs text-gray-400 ml-2">닫기</button>
        </div>
      ))}
    </div>
  );
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <InnerToastProvider>
      {children}
      <ToastContainer />
    </InnerToastProvider>
  );
}
