"use client"
import { useEffect, useState } from "react"
import api from "@/utils/axios"
import Card from "../components/Card"
import PageHeader from "../components/PageHeader"
import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"

interface DashboardData {
  total_orders: number
  pending_orders: number
  completed_orders: number
  total_revenue: string
  new_users_today: number
  active_chat_rooms: number
  unresolved_cs_posts: number
  order_status_chart: {
    pending: number
    processing: number
    completed: number
    cancelled: number
  }
  urgent_notifications: Array<{
    id: number
    message: string
    priority: "urgent" | "normal"
    created_at: string
  }>
  waiting_queue: Array<{
    id: number
    customer_name: string
    order_number: string
    position: number
  }>
}

export default function DashboardSummaryPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .get("/dashboard/global/")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading text="대시보드를 불러오는 중..." />
  if (error) return <ErrorMessage message={error} />
  if (!data) return null

  const stats = [
    {
      title: "총 주문",
      value: data.total_orders,
      icon: "📦",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "대기 중인 주문",
      value: data.pending_orders,
      icon: "⏳",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "+5%",
      changeType: "neutral",
    },
    {
      title: "완료된 주문",
      value: data.completed_orders,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+18%",
      changeType: "positive",
    },
    {
      title: "총 매출",
      value: `${Number(data.total_revenue).toLocaleString()}원`,
      icon: "💰",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+25%",
      changeType: "positive",
    },
    {
      title: "오늘 신규 사용자",
      value: data.new_users_today,
      icon: "👥",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "활성 채팅방",
      value: data.active_chat_rooms,
      icon: "💬",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "+3%",
      changeType: "positive",
    },
    {
      title: "미해결 문의",
      value: data.unresolved_cs_posts,
      icon: "🎧",
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-15%",
      changeType: "positive",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="대시보드" subtitle="비즈니스 현황을 한눈에 확인하세요" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">지난 주 대비</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 상태 분포</h3>
          <div className="space-y-3">
            {[
              { label: "대기중", value: data.order_status_chart?.pending || 0, color: "bg-yellow-500" },
              { label: "진행중", value: data.order_status_chart?.processing || 0, color: "bg-blue-500" },
              { label: "완료", value: data.order_status_chart?.completed || 0, color: "bg-green-500" },
              { label: "취소", value: data.order_status_chart?.cancelled || 0, color: "bg-red-500" },
            ].map((item, index) => {
              const total = Object.values(data.order_status_chart || {}).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (item.value / total) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.value}건</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Urgent Notifications */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">긴급 알림</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(data.urgent_notifications || []).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    notification.priority === "urgent" ? "bg-red-500" : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.created_at}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    notification.priority === "urgent" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {notification.priority === "urgent" ? "긴급" : "일반"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Waiting Queue */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">대기 순번 관리</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.waiting_queue || []).map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-purple-600">#{item.position}</span>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{item.position}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">{item.customer_name}</p>
              <p className="text-xs text-gray-500">{item.order_number}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            {[
              { type: "주문", desc: "새로운 주문이 접수되었습니다", time: "5분 전", icon: "📦" },
              { type: "사용자", desc: "새로운 사용자가 가입했습니다", time: "12분 전", icon: "👤" },
              { type: "문의", desc: "고객 문의가 등록되었습니다", time: "25분 전", icon: "💬" },
              { type: "결제", desc: "결제가 완료되었습니다", time: "1시간 전", icon: "💳" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.desc}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "새 주문", href: "/order/create", icon: "➕", color: "bg-purple-500" },
              { title: "주문 관리", href: "/order", icon: "📋", color: "bg-blue-500" },
              { title: "고객 문의", href: "/cs-post", icon: "🎧", color: "bg-green-500" },
              { title: "공지 작성", href: "/notice/create", icon: "📢", color: "bg-orange-500" },
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div
                  className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-white text-lg">{action.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "서버 상태", status: "정상", color: "text-green-600", bgColor: "bg-green-100" },
            { name: "데이터베이스", status: "정상", color: "text-green-600", bgColor: "bg-green-100" },
            { name: "결제 시스템", status: "정상", color: "text-green-600", bgColor: "bg-green-100" },
          ].map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{system.name}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${system.bgColor} ${system.color}`}>
                {system.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
