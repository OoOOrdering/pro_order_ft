"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import * as React from "react"

interface AnimatedLayoutProps {
  children: React.ReactNode
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Page content with animation */}
      <div
        className={`transition-all duration-300 ease-out ${
          isLoading ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
        }`}
      >
        {children}
      </div>
    </>
  )
}
