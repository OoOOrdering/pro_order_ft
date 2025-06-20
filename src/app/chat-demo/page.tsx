"use client"

import { useState } from "react"
import OrderForm from "@/components/OrderForm"
// import OrderList from "@/components/OrderList"
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

// 이 페이지는 채팅/주문/FAQ 등 샘플 데모용입니다. 실제 기능은 각 도메인별 대표 페이지에서 확인하세요.
export default function ChatDemo() {
  return (
    <div className="p-4 text-center">
      <h1>Chat Demo Page</h1>
      <p className="text-muted-foreground">실제 채팅/주문/FAQ 등은 각 도메인별 대표 페이지에서 확인하세요.</p>
    </div>
  );
}
