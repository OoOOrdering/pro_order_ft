"use client"

import { useState } from "react"
import { cn } from "../lib/utils"
import Button from "./Button"
import Card from "./Card"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  nickname: string
  email: string
  profileImage?: string
  joinDate: string
}

interface OrderSummary {
  totalOrders: number
  inProgressOrders: number
  completedOrders: number
  totalReviews: number
}

interface MyPageProps {
  isAdmin?: boolean
  className?: string
}

export default function MyPage({ isAdmin = false, className }: MyPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<UserProfile>({
    id: "user123",
    nickname: "김사용자",
    email: "user@example.com",
    joinDate: "2024-01-15",
  })

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    totalOrders: 12,
    inProgressOrders: 3,
    completedOrders: 9,
    totalReviews: 8,
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const summaryCards = [
    {
      title: "총 주문",
      value: orderSummary.totalOrders,
      icon: "📦",
      color: "bg-blue-50 text-blue-600",
      onClick: () => router.push("/my-orders"),
    },
    {
      title: "진행 중",
      value: orderSummary.inProgressOrders,
      icon: "⚡",
      color: "bg-orange-50 text-orange-600",
      onClick: () => router.push("/my-orders?status=in_progress"),
    },
    {
      title: "완료됨",
      value: orderSummary.completedOrders,
      icon: "✅",
      color: "bg-green-50 text-green-600",
      onClick: () => router.push("/my-orders?status=completed"),
    },
    {
      title: "내 리뷰",
      value: orderSummary.totalReviews,
      icon: "⭐",
      color: "bg-purple-50 text-purple-600",
      onClick: () => router.push("/my-reviews"),
    },
  ]

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage || "/placeholder.svg"}
                alt="프로필 이미지"
                className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border-4 border-primary/20">
                <span className="text-white text-2xl font-bold">{profile.nickname.charAt(0)}</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{profile.nickname}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground mt-1">가입일: {formatDate(profile.joinDate)}</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Button onClick={() => router.push("/profile/edit")} variant="outline" fullWidth>
            프로필 수정
          </Button>
          <Button onClick={() => router.push("/settings")} variant="outline" fullWidth>
            설정
          </Button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "개요", icon: "📊" },
            { id: "reviews", label: "내 리뷰", icon: "⭐" },
            { id: "orders", label: "주문 내역", icon: "📦" },
            { id: "favorites", label: "즐겨찾기", icon: "❤️" },
            ...(isAdmin ? [{ id: "admin", label: "관리자", icon: "⚙️" }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-4">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div
                onClick={card.onClick}
                className="text-center space-y-3"
                style={{ cursor: 'pointer' }}
              >
                <div className={cn("w-12 h-12 rounded-full mx-auto flex items-center justify-center", card.color)}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "admin" && isAdmin && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">관리자 전용 메뉴</h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth onClick={() => router.push("/admin/orders")} className="justify-start">
              📋 전체 주문 관리
            </Button>
            <Button variant="outline" fullWidth onClick={() => router.push("/admin/forms")} className="justify-start">
              📝 양식 관리
            </Button>
            <Button variant="outline" fullWidth onClick={() => router.push("/admin/users")} className="justify-start">
              👥 사용자 관리
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push("/admin/analytics")}
              className="justify-start"
            >
              📈 통계 및 분석
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">빠른 실행</h3>
        <div className="space-y-3">
          <Button variant="outline" fullWidth onClick={() => router.push("/order/create")} className="justify-start">
            📝 새 주문 작성
          </Button>
          <Button variant="outline" fullWidth onClick={() => router.push("/my-reviews")} className="justify-start">
            ⭐ 내가 쓴 리뷰 보기
          </Button>
          <Button variant="outline" fullWidth onClick={() => router.push("/support")} className="justify-start">
            🎧 고객센터 문의
          </Button>
          <Button variant="outline" fullWidth onClick={() => router.push("/notifications")} className="justify-start">
            🔔 알림 설정
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              /* 로그아웃 로직 */
            }}
            className="justify-start text-red-600"
          >
            🚪 로그아웃
          </Button>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">계정 정보</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">회원 등급</span>
            <span className="font-medium text-foreground">일반 회원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">포인트</span>
            <span className="font-medium text-foreground">1,250P</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">쿠폰</span>
            <span className="font-medium text-foreground">3장</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
