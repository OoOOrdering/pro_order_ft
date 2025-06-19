"use client"

import { useState } from "react"
import OrderForm from "@/components/OrderForm"
import OrderList from "@/components/OrderList"
import OrderTimeline from "@/components/OrderTimeline"
import AdminOrderView from "@/components/AdminOrderView"

const tabs = [
  { id: "chat", label: "채팅", icon: "💬" },
  { id: "order-form", label: "주문서", icon: "📝" },
  { id: "order-list", label: "주문 목록", icon: "📋" },
  { id: "order-timeline", label: "진행 상태", icon: "⏱️" },
  { id: "admin-order", label: "관리자 뷰", icon: "👨‍💼" },
  { id: "stats", label: "통계", icon: "📊" },
  { id: "notices", label: "공지", icon: "📢" },
  { id: "faq", label: "FAQ", icon: "❓" },
]

export default function ChatDemo() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Demo Page</h1>

      {/* Tab navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 ${
              activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "chat" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">채팅 내용</h3>
            <p>채팅 기능은 아직 개발 중입니다.</p>
          </div>
        )}

        {activeTab === "order-form" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">주문서 작성</h3>
            <OrderForm
              formData={{
                title: "맞춤 의상 제작",
                description: "원하시는 의상을 상세히 설명해주세요",
                fields: [
                  {
                    id: "1",
                    type: "text",
                    label: "이름",
                    required: true,
                    placeholder: "성함을 입력해주세요",
                  },
                  {
                    id: "2",
                    type: "radio",
                    label: "의상 종류",
                    required: true,
                    options: ["한복", "양복", "드레스", "기타"],
                  },
                ],
              }}
              onSubmit={(data) => console.log("주문 제출:", data)}
              isAdmin={false}
            />
          </div>
        )}

        {activeTab === "order-list" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">주문 목록</h3>
            <OrderList />
          </div>
        )}

        {activeTab === "order-timeline" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">주문 진행 상태</h3>
            <OrderTimeline
              currentStep={2}
              steps={[
                {
                  id: 1,
                  title: "주문 접수",
                  description: "주문이 접수되었습니다",
                  completed: true,
                },
                {
                  id: 2,
                  title: "제작 중",
                  description: "현재 제작 중입니다",
                  completed: false,
                },
                {
                  id: 3,
                  title: "완성",
                  description: "제작이 완료되었습니다",
                  completed: false,
                },
                {
                  id: 4,
                  title: "배송",
                  description: "배송 중입니다",
                  completed: false,
                },
                {
                  id: 5,
                  title: "완료",
                  description: "주문이 완료되었습니다",
                  completed: false,
                },
              ]}
            />
          </div>
        )}

        {activeTab === "admin-order" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">관리자 주문 관리</h3>
            <AdminOrderView
              order={{
                id: 1,
                orderNumber: "ORD-2024-001",
                customerName: "김고객",
                customerEmail: "customer@example.com",
                status: "processing",
                items: [
                  { label: "의상 종류", value: "한복" },
                  { label: "사이즈", value: "M" },
                  { label: "색상", value: "빨간색" },
                ],
                memo: "고객 요청사항 확인 필요",
              }}
              onStatusChange={(status) => console.log("상태 변경:", status)}
              onSave={(data) => console.log("저장:", data)}
            />
          </div>
        )}

        {activeTab === "stats" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">통계</h3>
            <p>통계 기능은 아직 개발 중입니다.</p>
          </div>
        )}

        {activeTab === "notices" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">공지 사항</h3>
            <p>공지 사항 기능은 아직 개발 중입니다.</p>
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">FAQ</h3>
            <p>FAQ 기능은 아직 개발 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
