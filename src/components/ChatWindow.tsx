"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "../lib/utils"
import Button from "./Button"
import OrderStatusBar from "./OrderStatusBar"
import ChatExtensionMenu from "./ChatExtensionMenu"
import PaymentRequestModal from "./PaymentRequestModal"

interface Message {
  id: string
  content: string
  sender: "user" | "other"
  timestamp: Date
  type: "text" | "image" | "system" | "payment"
  imageUrl?: string
  paymentData?: {
    amount: number
    deadline: string
  }
}

interface ChatWindowProps {
  orderId: string
  currentStatus: "requested" | "in_progress" | "in_production" | "shipped" | "completed"
  isVendor?: boolean
  onStatusChange?: (newStatus: string) => void
  className?: string
}

const PRESET_MESSAGES = [
  "안녕하세요! 문의해주셔서 감사합니다.",
  "주문 확인되었습니다. 곧 작업을 시작하겠습니다.",
  "작업이 완료되었습니다. 확인 부탁드립니다.",
  "배송이 시작되었습니다. 송장번호를 확인해주세요.",
  "추가 문의사항이 있으시면 언제든 연락주세요.",
]

export default function ChatWindow({
  orderId,
  currentStatus,
  isVendor = false,
  onStatusChange,
  className,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "안녕하세요! 주문 문의드립니다.",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    {
      id: "2",
      content: "네, 안녕하세요! 어떤 도움이 필요하신가요?",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showExtensionMenu, setShowExtensionMenu] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setShowExtensionMenu(false)
  }

  const handlePresetMessage = (message: string) => {
    setInputValue(message)
    setShowExtensionMenu(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const newMessage: Message = {
        id: Date.now().toString(),
        content: "이미지를 전송했습니다.",
        sender: "user",
        timestamp: new Date(),
        type: "image",
        imageUrl,
      }
      setMessages((prev) => [...prev, newMessage])
      setShowExtensionMenu(false)
    }
  }

  const handlePaymentRequest = (amount: number, deadline: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `결제 요청: ${amount.toLocaleString()}원 (마감: ${deadline})`,
      sender: "user",
      timestamp: new Date(),
      type: "payment",
      paymentData: { amount, deadline },
    }
    setMessages((prev) => [...prev, newMessage])
    setShowPaymentModal(false)
  }

  const handleStatusUpdate = (newStatus: string) => {
    const statusMessages = {
      requested: "주문이 요청되었습니다.",
      in_progress: "주문 처리가 시작되었습니다.",
      in_production: "제작이 시작되었습니다.",
      shipped: "상품이 발송되었습니다.",
      completed: "주문이 완료되었습니다.",
    }

    const systemMessage: Message = {
      id: Date.now().toString(),
      content: statusMessages[newStatus as keyof typeof statusMessages],
      sender: "user",
      timestamp: new Date(),
      type: "system",
    }

    setMessages((prev) => [...prev, systemMessage])
    onStatusChange?.(newStatus)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Order Status Bar */}
      <OrderStatusBar
        currentStatus={currentStatus}
        isVendor={isVendor}
        onStatusChange={handleStatusUpdate}
        className="sticky top-0 z-10 bg-background border-b"
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start",
              message.type === "system" && "justify-center",
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.type === "system"
                    ? "bg-muted text-muted-foreground text-sm"
                    : "bg-card text-card-foreground border",
                message.type === "payment" && "border-2 border-yellow-400 bg-yellow-50",
              )}
            >
              {message.type === "image" && message.imageUrl && (
                <img
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="전송된 이미지"
                  className="max-w-full h-auto rounded-lg mb-2"
                />
              )}
              <p className="text-sm">{message.content}</p>
              {message.type === "payment" && message.paymentData && (
                <div className="mt-2 pt-2 border-t border-yellow-300">
                  <p className="text-xs text-yellow-700">금액: {message.paymentData.amount.toLocaleString()}원</p>
                  <p className="text-xs text-yellow-700">마감: {message.paymentData.deadline}</p>
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full min-h-[40px] max-h-[120px] px-3 py-2 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
          </div>

          {/* Extension Menu Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExtensionMenu(!showExtensionMenu)}
              className="h-10 w-10 p-0"
            >
              <span className={cn("transition-transform", showExtensionMenu && "rotate-45")}>+</span>
            </Button>

            {/* Extension Menu */}
            <ChatExtensionMenu
              isOpen={showExtensionMenu}
              onClose={() => setShowExtensionMenu(false)}
              onPresetMessage={handlePresetMessage}
              onImageUpload={() => fileInputRef.current?.click()}
              onPaymentRequest={() => setShowPaymentModal(true)}
              presetMessages={PRESET_MESSAGES}
              isVendor={isVendor}
            />
          </div>

          <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="h-10">
            전송
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {/* Payment Request Modal */}
      <PaymentRequestModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentRequest}
      />
    </div>
  )
}
