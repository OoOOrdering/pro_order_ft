"use client"
import { useState } from "react"
import type React from "react"

import { createOrder } from "@/api/swagger"
import type { OrderCreate, OrderItem } from "@/types/swagger"
import Button from "../../components/Button"
import Input from "../../components/Input"
import Card from "../../components/Card"
import PageHeader from "../../components/PageHeader"
import Loading from "../../components/Loading"
import ErrorMessage from "../../components/ErrorMessage"
import { useRouter } from "next/navigation"

const defaultItem = { product_name: "", quantity: 1, price: "0" }

export default function OrderCreatePage() {
  const [form, setForm] = useState<OrderCreate>({
    shipping_address: "",
    shipping_phone: "",
    shipping_name: "",
    shipping_memo: "",
    items: [{ ...defaultItem }],
    payment_method: "카드",
    total_amount: "0",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleItemChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const items = [...form.items]
    items[idx] = { ...items[idx], [e.target.name]: e.target.value }
    setForm((f) => ({ ...f, items }))
    updateTotal(items)
  }

  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { ...defaultItem }] }))
  }

  const removeItem = (idx: number) => {
    const items = form.items.filter((_, i) => i !== idx)
    setForm((f) => ({ ...f, items }))
    updateTotal(items)
  }

  const updateTotal = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    setForm((f) => ({ ...f, total_amount: String(total) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await createOrder(form)
      setSuccess("주문이 생성되었습니다!")
      setTimeout(() => router.push(`/order/${res.data.id}`), 1500)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading text="주문을 생성하는 중..." />

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="새 주문 생성"
        subtitle="주문 정보를 입력하여 새로운 주문을 생성하세요"
        breadcrumb={[{ label: "주문", href: "/order" }, { label: "새 주문" }]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            배송 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="shipping_name"
              value={form.shipping_name}
              onChange={handleChange}
              label="수령인"
              placeholder="받으실 분 성함"
              required
            />
            <Input
              name="shipping_phone"
              value={form.shipping_phone}
              onChange={handleChange}
              label="연락처"
              placeholder="010-0000-0000"
              required
            />
          </div>
          <Input
            name="shipping_address"
            value={form.shipping_address}
            onChange={handleChange}
            label="배송 주소"
            placeholder="상세 주소를 입력해주세요"
            required
          />
          <Input
            name="shipping_memo"
            value={form.shipping_memo}
            onChange={handleChange}
            label="배송 메모"
            placeholder="배송 시 요청사항 (선택사항)"
          />
        </Card>

        {/* Order Items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              주문 상품
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              상품 추가
            </Button>
          </div>

          <div className="space-y-4">
            {form.items.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">상품 #{idx + 1}</span>
                  {form.items.length > 1 && (
                    <Button type="button" variant="danger" size="sm" onClick={() => removeItem(idx)}>
                      삭제
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    name="product_name"
                    value={item.product_name}
                    onChange={(e) => handleItemChange(idx, e)}
                    label="상품명"
                    placeholder="상품명을 입력하세요"
                    required
                  />
                  <Input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, e)}
                    label="수량"
                    min={1}
                    required
                  />
                  <Input
                    name="price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, e)}
                    label="단가 (원)"
                    min={0}
                    required
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="text-sm text-gray-600">
                    소계:{" "}
                    <span className="font-semibold text-purple-600">
                      {(Number(item.price) * Number(item.quantity)).toLocaleString()}원
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Information */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            결제 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결제 방법</label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="카드">신용카드</option>
                <option value="계좌이체">계좌이체</option>
                <option value="무통장입금">무통장입금</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                총 {Number(form.total_amount).toLocaleString()}원
              </div>
              <div className="text-sm text-gray-500">VAT 포함</div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            disabled={
              !form.shipping_name ||
              !form.shipping_phone ||
              !form.shipping_address ||
              form.items.some((item) => !item.product_name)
            }
          >
            {loading ? "주문 생성 중..." : "주문하기"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/order")} className="sm:w-auto">
            취소
          </Button>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-green-700">{success}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
