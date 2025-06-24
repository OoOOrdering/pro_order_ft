import * as React from "react"
import { safeRender } from "@/lib/safeRender"
import TextRenderer from "@/lib/safeTextRender"

function safeRenderValue(value: any) {
  if (React.isValidElement(value)) return value
  if (typeof value === "object" && value !== null) return JSON.stringify(value)
  return String(value)
}

interface PageHeaderProps {
  title: any // string에서 any로 변경하여 방어
  subtitle?: any
  action?: React.ReactNode
  breadcrumb?: Array<{ label: string; href?: string }>
}

export default function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  console.log('PageHeader:title', typeof title, title)
  console.log('PageHeader:subtitle', typeof subtitle, subtitle)

  return (
    <div className="mb-6 sm:mb-8">
      {breadcrumb && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumb.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-muted-foreground mx-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {item.href ? (
                  <a href={item.href} className="text-primary hover:text-primary/80">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground"><TextRenderer value={title} context="PageHeader.title" /></h1>
          {subtitle && <p className="mt-1 text-sm sm:text-base text-muted-foreground"><TextRenderer value={subtitle} context="PageHeader.subtitle" /></p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
