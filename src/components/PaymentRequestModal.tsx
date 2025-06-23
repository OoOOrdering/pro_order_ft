"use client"

import * as React from "react"

import { useState } from "react"
import Button from "./Button"
import Input from "./Input"

interface PaymentRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (amount: number, deadline: string) => void
}

export default function PaymentRequestModal({ isOpen, onClose, onSubmit }: PaymentRequestModalProps) {
  const [amount, setAmount] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount && deadline) {
      onSubmit(Number(amount), deadline)
      setAmount("")
      setDeadline("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-lg w-full max-w-md mx-4 p-6 animate-in zoom-in-95">
        <h3 className="text-lg font-semibold text-foreground mb-4">결제 요청</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="결제 금액"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="금액을 입력하세요"
            required
          />

          <Input
            label="결제 마감일"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              요청 전송
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
