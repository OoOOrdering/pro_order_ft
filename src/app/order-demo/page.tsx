"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import OrderForm from "../../components/OrderForm"
import FormBuilder from "../../components/FormBuilder"
import MyPage from "../../components/MyPage"
import ReviewDetail from "../../components/ReviewDetail"
import AdminOrderView from "../../components/AdminOrderView"
// import OrderList from "../../components/OrderList"
import OrderTimeline from "../../components/OrderTimeline"
import PageHeader from "../../components/PageHeader"
import Card from "../../components/Card"

export default function OrderDemo() {
  const [activeDemo, setActiveDemo] = useState<string>("form")

  // Sample data
  const sampleFormData = {
    id: "form_001",
    title: "맞춤 의상 주문서",
    description: "고객님의 맞춤 의상 제작을 위한 주문서입니다. 모든 항목을 정확히 입력해주세요.",
    fields: [
      {
        id: "name",
        type: "text" as const,
        label: "성함",
        required: true,
        placeholder: "실명을 입력해주세요",
      },
      {
        id: "size",
        type: "radio" as const,
        label: "사이즈",
        required: true,
        options: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: "colors",
        type: "checkbox" as const,
        label: "선호 색상 (복수 선택 가능)",
        required: false,
        options: ["블랙", "화이트", "네이비", "그레이", "베이지"],
      },
      {
        id: "delivery_date",
        type: "date" as const,
        label: "희망 배송일",
        required: true,
      },
      {
        id: "reference_images",
        type: "file" as const,
        label: "참고 이미지",
        required: false,
      },
    ],
  }

  const sampleReview = {
    id: "review_001",
    author: {
      nickname: "패션러버",
      profileImage: undefined,
    },
    rating: 5,
    date: "2024-01-15",
    orderInfo: {
      title: "맞춤 정장 제작",
      id: "ORDER_12345",
    },
    content:
      "정말 만족스러운 주문이었습니다!\n\n품질이 기대 이상으로 좋았고, 핏도 완벽했어요. 특히 디테일한 부분까지 신경써주셔서 감사합니다.\n\n다음에도 꼭 이용하고 싶습니다. 강력 추천합니다! 👍",
    images: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
    likes: 24,
    isLiked: false,
  }

  const sampleOrderData = {
    id: "ORDER_12345",
    title: "맞춤 정장 제작",
    status: "in_production" as const,
    customer: {
      name: "김고객",
      email: "customer@example.com",
      phone: "010-1234-5678",
    },
    formData: {
      성함: "김고객",
      사이즈: "L",
      "선호 색상": ["네이비", "그레이"],
      "희망 배송일": "2024-02-15",
      "참고 이미지": { name: "reference.jpg" },
    },
    internalMemo: "고객이 핏에 민감하니 치수 재확인 필요\n네이비 원단 재고 확인 완료",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  }

  const sampleOrders = [
    {
      id: "ORDER_001",
      title: "맞춤 정장 제작",
      status: "in_production" as const,
      date: "2024-01-15T10:30:00Z",
      customer: "김고객",
    },
    {
      id: "ORDER_002",
      title: "웨딩드레스 제작",
      status: "completed" as const,
      date: "2024-01-10T09:15:00Z",
      customer: "이신부",
    },
    {
      id: "ORDER_003",
      title: "캐주얼 셔츠 주문",
      status: "shipped" as const,
      date: "2024-01-12T16:45:00Z",
      customer: "박고객",
    },
  ]

  const sampleTimelineSteps = [
    {
      id: "requested",
      title: "주문 요청",
      description: "고객이 주문서를 제출했습니다.",
      icon: "📝",
      status: "completed" as const,
      date: "2024-01-15 10:30",
    },
    {
      id: "confirmed",
      title: "관리자 확인",
      description: "주문 내용을 검토하고 확인했습니다.",
      icon: "✅",
      status: "completed" as const,
      date: "2024-01-15 14:20",
    },
    {
      id: "production",
      title: "제작 중",
      description: "상품을 제작하고 있습니다.",
      icon: "🔨",
      status: "current" as const,
    },
    {
      id: "shipped",
      title: "발송 완료",
      description: "상품이 발송되었습니다.",
      icon: "🚚",
      status: "pending" as const,
    },
    {
      id: "completed",
      title: "거래 완료",
      description: "모든 거래가 완료되었습니다.",
      icon: "🎉",
      status: "pending" as const,
    },
  ]

  const demoTabs = [
    { id: "form", label: "주문서 작성", icon: "📝" },
    { id: "builder", label: "양식 등록", icon: "🔧" },
    { id: "mypage", label: "마이페이지", icon: "👤" },
    { id: "review", label: "리뷰 상세", icon: "⭐" },
    { id: "admin", label: "관리자 뷰", icon: "⚙️" },
    { id: "list", label: "주문 목록", icon: "📋" },
    { id: "timeline", label: "진행 상태", icon: "📈" },
  ]

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data)
    alert("주문서가 성공적으로 제출되었습니다!")
  }

  const handleFormSave = (formData: any) => {
    console.log("Form saved:", formData)
    alert("양식이 저장되었습니다!")
  }

  const handleReviewLike = () => {
    console.log("Review liked")
  }

  const handleReviewReport = () => {
    console.log("Review reported")
    alert("신고가 접수되었습니다.")
  }

  const handleStatusChange = (newStatus: string) => {
    console.log("Status changed to:", newStatus)
  }

  const handleOrderSave = (updates: any) => {
    console.log("Order updated:", updates)
    alert("주문 정보가 저장되었습니다!")
  }

  const handleOrderClick = (orderId: string) => {
    console.log("Order clicked:", orderId)
    alert(`주문 ${orderId} 상세 페이지로 이동합니다.`)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader title="주문 시스템 데모" subtitle="완전한 주문 관리 시스템의 모든 컴포넌트를 확인해보세요" />

      {/* Demo Tabs */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {demoTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDemo(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeDemo === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Demo Content */}
      <div className="space-y-8">
        {activeDemo === "form" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">주문서 작성</h2>
            <OrderForm formData={sampleFormData} onSubmit={handleFormSubmit} />
          </section>
        )}

        {activeDemo === "builder" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">양식 등록 (관리자)</h2>
            <FormBuilder onSave={handleFormSave} />
          </section>
        )}

        {activeDemo === "mypage" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">마이페이지</h2>
            <MyPage />
          </section>
        )}

        {activeDemo === "review" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">리뷰 상세</h2>
            <ReviewDetail review={sampleReview} onLike={handleReviewLike} onReport={handleReviewReport} />
          </section>
        )}

        {activeDemo === "admin" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">관리자 주문 관리</h2>
            <AdminOrderView orderData={sampleOrderData} onStatusChange={handleStatusChange} onSave={handleOrderSave} />
          </section>
        )}

        {/* {activeDemo === "list" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">주문 목록</h2>
            <OrderList orders={sampleOrders} onOrderClick={handleOrderClick} />
          </section>
        )} */}

        {activeDemo === "timeline" && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">주문 진행 상태</h2>
            <Card className="p-6">
              <OrderTimeline steps={sampleTimelineSteps} />
            </Card>
          </section>
        )}
      </div>
    </div>
  )
}
