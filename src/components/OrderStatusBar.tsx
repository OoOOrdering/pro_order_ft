"use client"

import { cn } from "../lib/utils"
import Button from "./Button"

interface OrderStatusBarProps {
  currentStatus: "requested" | "in_progress" | "in_production" | "shipped" | "completed"
  isVendor?: boolean
  onStatusChange?: (newStatus: string) => void
  className?: string
}

const STATUS_STEPS = [
  { key: "requested", label: "요청됨", icon: "📝" },
  { key: "in_progress", label: "진행중", icon: "⚡" },
  { key: "in_production", label: "제작중", icon: "🔨" },
  { key: "shipped", label: "발송됨", icon: "🚚" },
  { key: "completed", label: "완료", icon: "✅" },
]

export default function OrderStatusBar({ currentStatus, isVendor, onStatusChange, className }: OrderStatusBarProps) {
  const currentIndex = STATUS_STEPS.findIndex((step) => step.key === currentStatus)

  return (
    <div className={cn("bg-card border-b p-4", className)}>
      {/* Status Timeline */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">주문 진행 상황</h3>
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    index <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {step.icon}
                </div>

                {/* Connecting Line */}
                {index < STATUS_STEPS.length - 1 && (
                  <div
                    className={cn("flex-1 h-0.5 mx-2 transition-all", index < currentIndex ? "bg-primary" : "bg-muted")}
                  />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "text-xs mt-2 text-center",
                  index <= currentIndex ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Controls */}
      {isVendor && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">상태 변경</h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_STEPS.map((step) => (
              <Button
                key={step.key}
                variant={step.key === currentStatus ? "primary" : "outline"}
                size="sm"
                onClick={() => onStatusChange?.(step.key)}
                disabled={step.key === currentStatus}
                className="text-xs"
              >
                {step.icon} {step.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
