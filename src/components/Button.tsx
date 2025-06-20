import React from "react"
import { cn } from "../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  loading?: boolean
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border",
    danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-background",
    ghost: "text-primary hover:bg-primary/10",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const widthClass = fullWidth ? "w-full" : ""

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], widthClass, className)

  return (
    <button
      className={classes + " min-h-[44px] min-w-[44px]"} // 모바일 터치 영역 확대
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  )
}
