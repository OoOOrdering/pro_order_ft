"use client";
import { useEffect, useState } from "react";
import { getOrderList, deleteOrder, exportOrdersCsv } from "@/api/swagger";
import type { Order } from "@/types/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getOrderList();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteOrder(id);
      setSuccess("삭제되었습니다.");
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError("");
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
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">주문 목록</h2>
      <div className="flex gap-2 mb-4">
        <Button onClick={fetchOrders} color="primary">새로고침</Button>
        <Button onClick={handleExport} color="default">CSV 내보내기</Button>
        <Button onClick={() => router.push("/order/create")} color="primary">주문 생성</Button>
      </div>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <ul className="divide-y">
        {orders.length === 0 && <li className="py-4 text-gray-400">주문이 없습니다.</li>}
        {orders.map((order) => (
          <li key={order.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-semibold">{order.order_number} <span className="text-xs text-gray-400">({order.status_display})</span></div>
              <div className="text-xs text-gray-500">{order.created_at?.slice(0, 10)} | {order.shipping_name} | {order.total_amount}원</div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/order/${order.id}`)} color="default">상세</Button>
              <Button onClick={() => router.push(`/order/edit/${order.id}`)} color="primary">수정</Button>
              <Button onClick={() => handleDelete(order.id)} color="danger">삭제</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
