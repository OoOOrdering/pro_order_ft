"use client"

import { useState } from "react"
import { cn } from "../lib/utils"

interface TimelineStep {
  id: string
  title: string
  description: string
  icon: string
  status: "completed" | "current" | "pending"
  date?: string
}

interface OrderTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export default function OrderTimeline({ steps, className }: OrderTimelineProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "current":
        return "bg-primary text-primary-foreground animate-pulse"
      case "pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getConnectorColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === "completed") return "bg-green-500"
    if (currentStatus === "current" && nextStatus === "pending") return "bg-gradient-to-r from-primary to-muted"
    return "bg-muted"
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative">
              <button
                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 hover:scale-110",
                  getStepColor(step.status),
                )}
              >
                {step.icon}
              </button>

              {/* Tooltip */}
              {selectedStep === step.id && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-64 p-3 bg-card border rounded-lg shadow-lg animate-in zoom-in-95">
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.date && <p className="text-xs text-muted-foreground">📅 {step.date}</p>}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-l border-t rotate-45"></div>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    getConnectorColor(step.status, steps[index + 1]?.status),
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-start justify-between mt-4">
        {steps.map((step) => (
          <div key={`${step.id}-label`} className="flex-1 text-center px-2">
            <h4
              className={cn(
                "text-sm font-medium transition-colors",
                step.status === "completed" || step.status === "current" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.title}
            </h4>
            {step.date && <p className="text-xs text-muted-foreground mt-1">{step.date}</p>}
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-8 space-y-4">
        {steps.map((step, index) => (
          <div key={`mobile-${step.id}`} className="flex items-start space-x-3">
            <div
              className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm", getStepColor(step.status))}
            >
              {step.icon}
            </div>
            <div className="flex-1">
              <h4
                className={cn(
                  "font-medium",
                  step.status === "completed" || step.status === "current"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.date && <p className="text-xs text-muted-foreground mt-1">{step.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
