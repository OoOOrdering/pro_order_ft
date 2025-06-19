"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type React from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    if (displayChildren !== children) {
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
      }, 150)

      return () => clearTimeout(timer)
    }
  }, [children, displayChildren])

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isTransitioning ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"
        }`}
      >
        {displayChildren}
      </div>
    </div>
  )
}
