"use client"
import { useEffect, useState } from "react"
import { getOrderList, deleteOrder, exportOrdersCsv } from "@/api/swagger"
import type { Order } from "@/types/swagger"
import Button from "../components/Button"
import Card from "../components/Card"
import PageHeader from "../components/PageHeader"
import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"
import { useRouter } from "next/navigation"

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await getOrderList()
      setOrders(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    setLoading(true)
    setError("")
    try {
      await deleteOrder(id)
      setSuccess("삭제되었습니다.")
      fetchOrders()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await exportOrdersCsv()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "orders.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "REFUNDED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && orders.length === 0) return <Loading text="주문 목록을 불러오는 중..." />

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="주문 관리"
        subtitle="모든 주문을 확인하고 관리하세요"
        action={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleExport} variant="outline" size="sm" disabled={loading}>
              CSV 내보내기
            </Button>
            <Button onClick={() => router.push("/order/create")} size="sm">
              새 주문
            </Button>
          </div>
        }
      />

      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
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

      {orders.length === 0 && !loading ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">주문이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 주문을 생성해보세요</p>
          <Button onClick={() => router.push("/order/create")}>새 주문 생성</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status_display}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {order.shipping_name}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                        />
                      </svg>
                      {Number(order.total_amount).toLocaleString()}원
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {order.payment_method}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                        />
                      </svg>
                      {order.created_at?.slice(0, 10)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                  <Button onClick={() => router.push(`/order/${order.id}`)} variant="outline" size="sm" fullWidth>
                    상세보기
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push(`/order/edit/${order.id}`)} size="sm" className="flex-1">
                      수정
                    </Button>
                    <Button onClick={() => handleDelete(order.id)} variant="danger" size="sm" className="flex-1">
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {loading && orders.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-sm text-gray-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            처리 중...
          </div>
        </div>
      )}
    </div>
  )
}
