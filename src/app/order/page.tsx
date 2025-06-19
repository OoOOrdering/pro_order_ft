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
import Head from "next/head"
import DownloadOrderExcel from "@/components/DownloadOrderExcel";
import DownloadOrderPdf from "@/components/DownloadOrderPdf";
import AccessibilitySample from "@/components/AccessibilitySample";
import { useQuery } from "@tanstack/react-query"

export default function OrderPage() {
  const { data: orders = [], isLoading: loading, error, refetch } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await getOrderList();
      return data;
    },
  });
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteOrder(id);
      setSuccess("삭제되었습니다.");
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportOrdersCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message);
    }
  };

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
    <>
      <Head>
        <title>주문 목록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main role="main" aria-label="주요 콘텐츠" className="px-2 sm:px-0 max-w-2xl mx-auto">
        <PageHeader title="주문 목록" />
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {success && <div className="text-green-600" role="status">{success}</div>}
        <Card>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
            <Button onClick={handleExport} aria-label="주문 내보내기(CSV)">CSV 내보내기</Button>
            <DownloadOrderExcel orders={orders} />
          </div>
          <ul className="divide-y" role="list" aria-label="주문 목록">
            {orders.map((order: Order, idx: number) => (
              <li key={order.id} className="py-2 flex flex-col sm:flex-row sm:items-center gap-2" tabIndex={0} aria-label={`주문 ${order.id}`}>
                <span className="flex-1">{order.title}</span>
                <DownloadOrderPdf order={order} />
                <Button onClick={() => router.push(`/order/${order.id}`)} size="sm" variant="outline" aria-label="상세보기">상세</Button>
                <Button onClick={() => router.push(`/order/edit/${order.id}`)} size="sm" variant="secondary" aria-label="수정">수정</Button>
                <Button onClick={() => handleDelete(order.id!)} size="sm" variant="danger" aria-label="삭제">삭제</Button>
              </li>
            ))}
          </ul>
        </Card>
        <div className="mt-8">
          <AccessibilitySample />
        </div>
      </main>
    </>
  )
}
