"use client"

import { useState } from "react"
import { cn } from "../lib/utils"
import Card from "./Card"

interface Notice {
  id: string
  title: string
  content: string
  date: string
  views: number
  isImportant?: boolean
}

interface NoticeListProps {
  notices: Notice[]
  className?: string
}

export default function NoticeList({ notices, className }: NoticeListProps) {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className={cn("space-y-4", className)}>
      {notices.map((notice) => (
        <Card key={notice.id} className="hover:shadow-md transition-all duration-200">
          <div
            className="cursor-pointer"
            onClick={() => setSelectedNotice(selectedNotice === notice.id ? null : notice.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {notice.isImportant && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">중요</span>
                  )}
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{notice.title}</h3>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>{formatDate(notice.date)}</span>
                  <span>조회 {notice.views.toLocaleString()}</span>
                </div>
              </div>
              <div className="ml-4">
                <span
                  className={cn("transition-transform duration-200", selectedNotice === notice.id ? "rotate-180" : "")}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Content */}
            {selectedNotice === notice.id && (
              <div className="mt-4 pt-4 border-t animate-in slide-in-from-top-2">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="whitespace-pre-wrap">{notice.content}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
