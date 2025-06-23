"use client";

import * as React from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import ToastProvider from "../components/ToastProvider";
import I18nProvider from "../i18n/I18nProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider defaultTheme="system" storageKey="pr-order-theme">
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
