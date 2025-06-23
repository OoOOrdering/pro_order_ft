"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import NotificationBadge from "@/components/NotificationBadge";
import NotificationSettings from "@/components/NotificationSettings";
import { ThemeToggle } from "@/components/ThemeToggle";
import OnboardingGuide from "@/components/OnboardingGuide";
import ReactQueryProvider from "../providers/ReactQueryProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<string | null>(null);
  useEffect(() => {
    import("@/api/swagger").then(({ getProfile }) => {
      getProfile().then(res => setUserType(res.data.user_type)).catch(() => setUserType(null));
    });
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>
        <div className="fixed top-2 right-2 flex gap-2 z-50">
          <ThemeToggle />
          <NotificationBadge />
          <NotificationSettings />
        </div>
        <OnboardingGuide />
        {/* 관리자 메뉴 샘플 */}
        {userType === 'ADMIN' && (
          <nav className="bg-purple-100 text-purple-800 px-4 py-2 mb-2 rounded shadow max-w-2xl mx-auto mt-2">
            <span className="font-bold mr-2">[관리자]</span>
            <a href="/admin/dashboard" className="mr-4 underline">관리자 대시보드</a>
            <a href="/admin/users" className="mr-4 underline">회원 관리</a>
            <a href="/admin/orders" className="underline">주문 관리</a>
          </nav>
        )}
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
