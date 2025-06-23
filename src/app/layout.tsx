import type React from "react"
import type { Metadata } from "next"
import "../i18n/config"
import ClientProviders from "./client-providers"
import DefaultSeoWrapper from "./default-seo"

export const metadata: Metadata = {
  title: "PR Order",
  description: "효율적인 주문 관리와 팀 협업을 위한 올인원 플랫폼",
  openGraph: {
    title: "PR Order - 프론트엔드 자동화",
    description: "Next.js 자동화 프론트엔드",
    locale: "ko_KR",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ClientProviders>
          <DefaultSeoWrapper />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
