"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import Card from "./Card"

interface WaitingQueueProps {
  orderId: number
  currentPosition: number
  totalWaiting: number
  estimatedTime?: string
  className?: string
}

export default function WaitingQueue({
  orderId,
  currentPosition,
  totalWaiting,
  estimatedTime,
  className,
}: WaitingQueueProps) {
  const [position, setPosition] = useState(currentPosition)
  const [isUpdating, setIsUpdating] = useState(false)

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    if (currentPosition !== position) {
      setIsUpdating(true)
      const timer = setTimeout(() => {
        setPosition(currentPosition)
        setIsUpdating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentPosition, position])

  const getPositionColor = (pos: number) => {
    if (pos <= 3) return "from-green-400 to-green-600"
    if (pos <= 10) return "from-yellow-400 to-yellow-600"
    return "from-red-400 to-red-600"
  }

  const getPositionText = (pos: number) => {
    if (pos === 1) return "다음 순서입니다!"
    if (pos <= 3) return "곧 시작됩니다"
    if (pos <= 10) return "조금만 기다려주세요"
    return "대기 중입니다"
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20" />

      <div className="relative z-10 p-6">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">주문 대기 순번</h3>
          <p className="text-sm text-muted-foreground">주문번호: #{orderId}</p>
        </div>

        {/* 메인 순번 표시 */}
        <div className="text-center mb-6">
          <div
            className={cn(
              "inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br text-white font-bold text-3xl shadow-lg transition-all duration-500",
              getPositionColor(position),
              isUpdating && "scale-110 animate-pulse",
            )}
          >
            {position}
          </div>
          <p className="text-xl font-semibold text-foreground mt-4">{getPositionText(position)}</p>
        </div>

        {/* 상세 정보 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-sm text-muted-foreground">현재 순번</span>
            <span className="font-semibold text-foreground">{position}번째</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
            <span className="text-sm text-muted-foreground">전체 대기</span>
            <span className="font-semibold text-foreground">{totalWaiting}명</span>
          </div>

          {estimatedTime && (
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
              <span className="text-sm text-muted-foreground">예상 시간</span>
              <span className="font-semibold text-foreground">{estimatedTime}</span>
            </div>
          )}
        </div>

        {/* 진행률 바 */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>대기 중</span>
            <span>시작</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.max(5, ((totalWaiting - position + 1) / totalWaiting) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 업데이트 알림 */}
        {isUpdating && (
          <div className="absolute top-4 right-4">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs animate-bounce">업데이트 중...</div>
          </div>
        )}
      </div>
    </Card>
  )
}
