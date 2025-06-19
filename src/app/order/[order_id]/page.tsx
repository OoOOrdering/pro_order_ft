"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder, cancelOrder, refundOrder, exportOrderPdf, getOrderStatusLogs } from "@/api/swagger";
import type { Order } from "@/types/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.order_id;
  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    Promise.all([
      getOrder(Number(orderId)),
      getOrderStatusLogs({ order: orderId })
    ])
      .then(([orderRes, logsRes]) => {
        setOrder(orderRes.data);
        setLogs(logsRes.data.results || logsRes.data || []);
      })
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    if (!confirm("정말 주문을 취소하시겠습니까?")) return;
    setLoading(true);
    setError("");
    try {
      await cancelOrder(Number(orderId));
      setSuccess("주문이 취소되었습니다.");
      router.push("/order");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRefund = async () => {
    if (!confirm("정말 환불 처리하시겠습니까? (관리자만 가능)")) return;
    setLoading(true);
    setError("");
    try {
      await refundOrder(Number(orderId));
      setSuccess("환불 처리되었습니다.");
      router.push("/order");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleExportPdf = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await exportOrderPdf(Number(orderId));
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order_${orderId}.pdf`);
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
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">주문 상세</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-2 text-sm text-gray-500">주문번호: {order.order_number}</div>
      <div className="mb-2">상태: <span className="font-semibold">{order.status_display}</span></div>
      <div className="mb-2">총 금액: <span className="font-semibold">{order.total_amount}원</span></div>
      <div className="mb-2">결제 방법: {order.payment_method} / 결제 상태: {order.payment_status}</div>
      <div className="mb-2">수령인: {order.shipping_name} / 연락처: {order.shipping_phone}</div>
      <div className="mb-2">배송 주소: {order.shipping_address}</div>
      {order.shipping_memo && <div className="mb-2">배송 메모: {order.shipping_memo}</div>}
      <div className="mb-2 text-xs text-gray-400">생성일: {order.created_at?.slice(0, 10)}</div>
      <div className="mb-2 text-xs text-gray-400">수정일: {order.updated_at?.slice(0, 10)}</div>
      {order.cancelled_at && <div className="mb-2 text-xs text-red-500">취소일: {order.cancelled_at?.slice(0, 10)}</div>}
      {order.refunded_at && <div className="mb-2 text-xs text-blue-500">환불일: {order.refunded_at?.slice(0, 10)}</div>}
      <div className="mb-4">
        <div className="font-bold">주문 아이템</div>
        <ul className="list-disc ml-6">
          {order.items?.map((item, idx) => (
            <li key={item.id || idx} className="text-sm">
              {item.product_name} / {item.quantity}개 / {item.price}원
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => router.push(`/order/edit/${order.id}`)} color="primary">수정</Button>
        <Button onClick={handleCancel} color="danger">주문 취소</Button>
        <Button onClick={handleRefund} color="danger">환불(관리자)</Button>
        <Button onClick={handleExportPdf} color="default">PDF 내보내기</Button>
        <Button onClick={() => router.push("/order")} color="default">목록</Button>
      </div>
      <div className="mt-6">
        <h3 className="font-bold mb-2">상태 변경 이력</h3>
        <ul className="divide-y">
          {logs.length === 0 && <li className="py-2 text-gray-400">이력이 없습니다.</li>}
          {logs.map((log: any) => (
            <li key={log.id} className="py-2 text-xs">
              {log.status} / {log.changed_at || log.created_at}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
