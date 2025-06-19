"use client"

import { useState } from "react"
import { cn } from "../lib/utils"
import Button from "./Button"
import Card from "./Card"

interface OrderData {
  id: string
  title: string
  status: "requested" | "confirmed" | "in_production" | "shipped" | "completed"
  customer: {
    name: string
    email: string
    phone: string
  }
  formData: Record<string, any>
  internalMemo: string
  createdAt: string
  updatedAt: string
}

interface AdminOrderViewProps {
  orderData: OrderData
  onStatusChange: (newStatus: string) => void
  onSave: (updates: Partial<OrderData>) => void
  className?: string
}

const STATUS_OPTIONS = [
  { value: "requested", label: "요청됨", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "확인중", color: "bg-blue-100 text-blue-800" },
  { value: "in_production", label: "제작중", color: "bg-purple-100 text-purple-800" },
  { value: "shipped", label: "발송됨", color: "bg-green-100 text-green-800" },
  { value: "completed", label: "완료", color: "bg-gray-100 text-gray-800" },
]

export default function AdminOrderView({ orderData, onStatusChange, onSave, className }: AdminOrderViewProps) {
  const [activeTab, setActiveTab] = useState<"details" | "customer" | "memo">("details")
  const [status, setStatus] = useState(orderData.status)
  const [memo, setMemo] = useState(orderData.internalMemo)
  const [isEditing, setIsEditing] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as any)
    onStatusChange(newStatus)
  }

  const handleSave = () => {
    onSave({
      status,
      internalMemo: memo,
      updatedAt: new Date().toISOString(),
    })
    setIsEditing(false)
  }

  const getCurrentStatusInfo = () => {
    return STATUS_OPTIONS.find((option) => option.value === status)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ko-KR")
  }

  const renderFormData = () => {
    return Object.entries(orderData.formData).map(([key, value]) => (
      <div key={key} className="border-b pb-3 mb-3 last:border-b-0">
        <dt className="text-sm font-medium text-muted-foreground mb-1">{key}</dt>
        <dd className="text-foreground">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {item}
                </span>
              ))}
            </div>
          ) : typeof value === "object" && value?.name ? (
            <span className="text-sm text-blue-600">📎 {value.name}</span>
          ) : (
            <span>{String(value)}</span>
          )}
        </dd>
      </div>
    ))
  }

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{orderData.title}</h1>
            <p className="text-muted-foreground">주문번호: {orderData.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getCurrentStatusInfo()?.color)}>
              {getCurrentStatusInfo()?.label}
            </span>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "primary" : "outline"}>
              {isEditing ? "편집 완료" : "편집 모드"}
            </Button>
          </div>
        </div>

        {/* Status Change */}
        {isEditing && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-foreground mb-2">상태 변경</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "details", label: "주문 상세", icon: "📋" },
            { id: "customer", label: "고객 정보", icon: "👤" },
            { id: "memo", label: "내부 메모", icon: "📝" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
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
      <div className="space-y-6">
        {activeTab === "details" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">주문 상세 정보</h3>
            <dl className="space-y-3">{renderFormData()}</dl>
            <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
              <p>생성일: {formatDate(orderData.createdAt)}</p>
              <p>수정일: {formatDate(orderData.updatedAt)}</p>
            </div>
          </Card>
        )}

        {activeTab === "customer" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">고객 정보</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">이름</dt>
                <dd className="text-foreground">{orderData.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">이메일</dt>
                <dd className="text-foreground">{orderData.customer.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">연락처</dt>
                <dd className="text-foreground">{orderData.customer.phone}</dd>
              </div>
            </dl>
            <div className="mt-6 flex space-x-3">
              <Button variant="outline" size="sm">
                📧 이메일 보내기
              </Button>
              <Button variant="outline" size="sm">
                💬 채팅 시작
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "memo" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">내부 메모</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="내부 메모를 입력하세요..."
                />
                <Button onClick={handleSave} size="sm">
                  메모 저장
                </Button>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4">
                {memo ? (
                  <p className="text-foreground whitespace-pre-wrap">{memo}</p>
                ) : (
                  <p className="text-muted-foreground italic">메모가 없습니다.</p>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
