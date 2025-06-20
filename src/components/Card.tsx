import React from "react"
import { cn } from "../lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  shadow?: "none" | "sm" | "md" | "lg"
}

export default function Card({ children, className = "", padding = "md", shadow = "sm" }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground",
        paddingClasses[padding],
        shadowClasses[shadow],
        className,
        // 모바일 반응형 샘플
        "w-full max-w-full sm:max-w-md mx-auto",
      )}
      role="region"
      aria-label="카드 영역"
      tabIndex={0}
    >
      {children}
    </div>
  )
}
