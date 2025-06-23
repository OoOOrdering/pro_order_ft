import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/ThemeProvider"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { MobileNav } from "../components/MobileNav"
import AnimatedLayout from "../components/AnimatedLayout"
import "./globals.css"
import ClientRoot from "./ClientRoot"

const inter = Inter({ subsets: ["latin"] })

export default function Page() {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="pr-order-theme">
          <ClientRoot>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <AnimatedLayout>
                  <div className="container mx-auto px-4 py-6">메인 페이지</div>
                </AnimatedLayout>
              </main>
              <Footer />
              <MobileNav />
            </div>
          </ClientRoot>
        </ThemeProvider>
      </body>
    </html>
  )
}

// <List /> // renderItem 누락으로 주석 처리 또는 renderItem 추가 필요
