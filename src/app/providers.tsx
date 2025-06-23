"use client";

import * as React from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import ToastProvider from "../components/ToastProvider";
// 필요한 경우, 추가 Provider import

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pr-order-theme">
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
