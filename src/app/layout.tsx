import type React from "react"
import type { Metadata } from "next"
import RootLayout from "./page"
import Head from "next/head"
import { appWithTranslation } from "react-i18next";
import "../i18n/config";
import { ThemeProvider } from "next-themes";
import NotificationBadge from "@/components/NotificationBadge";
import NotificationSettings from "@/components/NotificationSettings";
import ThemeToggle from "@/components/ThemeToggle";
import OnboardingGuide from "@/components/OnboardingGuide";
import ReactQueryProvider from "../providers/ReactQueryProvider"
import { useEffect, useState } from "react";
import { getProfile } from "@/api/swagger";

export const metadata: Metadata = {
  title: "PR Order",
  description: "효율적인 주문 관리와 팀 협업을 위한 올인원 플랫폼",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<string | null>(null);
  useEffect(() => {
    getProfile().then(res => setUserType(res.data.user_type)).catch(() => setUserType(null));
  }, []);
  return (
    <html lang="ko">
      <Head>
        <title>PR Order - 프론트엔드 자동화</title>
        <meta name="description" content="PR Order - Next.js 자동화 프론트엔드" />
        <meta property="og:title" content="PR Order - 프론트엔드 자동화" />
        <meta property="og:description" content="PR Order - Next.js 자동화 프론트엔드" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
      </Head>
      <body>
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
      </body>
    </html>
  )
}
