"use client";
import ClientLayout from "./ClientLayout";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
