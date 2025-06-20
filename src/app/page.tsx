"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/ThemeProvider"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { MobileNav } from "../components/MobileNav"
import AnimatedLayout from "../components/AnimatedLayout"
import "./globals.css"
import { ToastContainer, useToast } from "../components/Toast"

const inter = Inter({ subsets: ["latin"] })

function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="pr-order-theme">
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <AnimatedLayout>
                  <div className="container mx-auto px-4 py-6">{children}</div>
                </AnimatedLayout>
              </main>
              <Footer />
              <MobileNav />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// <List /> // renderItem 누락으로 주석 처리 또는 renderItem 추가 필요
