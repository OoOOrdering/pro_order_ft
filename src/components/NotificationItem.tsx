"use client"
import { cn } from "../lib/utils"

interface NotificationItemProps {
  title: string
  content: string
  time: string
  isRead: boolean
  type?: "info" | "success" | "warning" | "error"
  className?: string
  onClick?: () => void
}

export default function NotificationItem({
  title,
  content,
  time,
  isRead,
  type = "info",
  className,
  onClick,
}: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "📢"
    }
  }

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600"
      case "warning":
        return "bg-yellow-100 text-yellow-600"
      case "error":
        return "bg-red-100 text-red-600"
      default:
        return "bg-purple-100 text-purple-600"
    }
  }

  const formatTime = (timeString: string) => {
    const now = new Date()
    const time = new Date(timeString)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "방금 전"
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return time.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer",
        isRead ? "bg-[#f8f8f8] border-gray-200 hover:bg-gray-50" : "bg-[#f4eeff] border-purple-200 hover:bg-purple-50",
        className,
      )}
      onClick={onClick}
    >
      {/* Unread indicator */}
      {!isRead && <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div
          className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", getIconBgColor(type))}
        >
          <span className="text-lg">{getIcon(type)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={cn("font-semibold text-sm", isRead ? "text-gray-700" : "text-gray-900")}>{title}</h4>
          </div>
          <p className={cn("text-sm mt-1 line-clamp-2", isRead ? "text-gray-500" : "text-gray-700")}>{content}</p>
        </div>
      </div>

      {/* Time */}
      <div className="flex justify-end mt-2">
        <span className={cn("text-xs", isRead ? "text-gray-400" : "text-purple-600")}>{formatTime(time)}</span>
      </div>
    </div>
  )
}
