"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder, cancelOrder, refundOrder, exportOrderPdf, getOrderStatusLogs } from "@/api/swagger";
import type { Order } from "@/types/swagger";
// OrderStatusLog 타입 임시 정의 (Swagger에 없을 경우)
interface OrderStatusLog {
  id: number;
  status: string;
  changed_at?: string;
  created_at?: string;
}
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import * as Sentry from "@sentry/nextjs";
import { connectOrderSocket, onOrderStatusChanged } from "@/utils/orderSocket";
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

const ErrorMessage = dynamic(() => import("@/components/ErrorMessage"), { loading: () => <div>로딩 중...</div> });

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.order_id;
  const [order, setOrder] = useState<Order | null>(null);
  const [logs, setLogs] = useState<OrderStatusLog[]>([]);
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

  useEffect(() => {
    connectOrderSocket(orderId?.toString() || 'order-room');
    onOrderStatusChanged((data) => {
      if (data.orderId === orderId) {
        setLoading(true);
        getOrder(Number(orderId)).then((orderRes) => setOrder(orderRes.data)).finally(() => setLoading(false));
      }
    });
  }, [orderId]);

  const { run: cancelOrderAsync, loading: canceling } = useAsync(cancelOrder, {
    onSuccess: () => {
      Sentry.captureMessage(`주문 취소: orderId=${orderId}`);
      Toast.show({ type: "success", message: "주문이 취소되었습니다." });
      router.push("/order");
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });
  const { run: refundOrderAsync, loading: refunding } = useAsync(refundOrder, {
    onSuccess: () => {
      Sentry.captureMessage(`주문 환불: orderId=${orderId}`);
      Toast.show({ type: "success", message: "환불 처리되었습니다." });
      router.push("/order");
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const handleCancel = async () => {
    if (!confirm("정말 주문을 취소하시겠습니까?")) return;
    await cancelOrderAsync(Number(orderId));
  };
  const handleRefund = async () => {
    if (!confirm("정말 환불 처리하시겠습니까? (관리자만 가능)")) return;
    await refundOrderAsync(Number(orderId));
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
    } catch (err) {
      // err 타입을 AxiosError 등으로 명확화하려면 필요시 import
      setError((err as any)?.response?.data?.detail || (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4" tabIndex={0} aria-label="주문 상세">주문 상세</h2>
      {success && <div className="text-green-600 mb-2" role="status">{success}</div>}
      <div className="mb-2 text-sm text-gray-500" aria-label={`주문번호: ${order.order_number}`}>주문번호: {order.order_number}</div>
      <div className="mb-2" aria-label={`상태: ${order.status_display}`}>상태: <span className="font-semibold">{order.status_display}</span></div>
      <div className="mb-2" aria-label={`총 금액: ${order.total_amount}원`}>총 금액: <span className="font-semibold">{order.total_amount}원</span></div>
      <div className="mb-2" aria-label={`결제 방법: ${order.payment_method} / 결제 상태: ${order.payment_status}`}>결제 방법: {order.payment_method} / 결제 상태: {order.payment_status}</div>
      <div className="mb-2" aria-label={`수령인: ${order.shipping_name} / 연락처: ${order.shipping_phone}`}>수령인: {order.shipping_name} / 연락처: {order.shipping_phone}</div>
      <div className="mb-2" aria-label={`배송 주소: ${order.shipping_address}`}>배송 주소: {order.shipping_address}</div>
      {order.shipping_memo && <div className="mb-2" aria-label={`배송 메모: ${order.shipping_memo}`}>배송 메모: {order.shipping_memo}</div>}
      <div className="mb-2 text-xs text-gray-400" aria-label={`생성일: ${order.created_at?.slice(0, 10)}`}>생성일: {order.created_at?.slice(0, 10)}</div>
      <div className="mb-2 text-xs text-gray-400" aria-label={`수정일: ${order.updated_at?.slice(0, 10)}`}>수정일: {order.updated_at?.slice(0, 10)}</div>
      {order.cancelled_at && <div className="mb-2 text-xs text-red-500" aria-label={`취소일: ${order.cancelled_at?.slice(0, 10)}`}>취소일: {order.cancelled_at?.slice(0, 10)}</div>}
      {order.refunded_at && <div className="mb-2 text-xs text-blue-500" aria-label={`환불일: ${order.refunded_at?.slice(0, 10)}`}>환불일: {order.refunded_at?.slice(0, 10)}</div>}
      <div className="mb-4">
        <div className="font-bold" tabIndex={0} aria-label="주문 아이템">주문 아이템</div>
        <ul className="list-disc ml-6" role="list" aria-label="주문 아이템 목록">
          {order.items?.map((item, idx) => (
            <li key={item.id || idx} className="text-sm" tabIndex={0} aria-label={`상품명: ${item.product_name}, 수량: ${item.quantity}개, 가격: ${item.price}원`}>
              {item.product_name} / {item.quantity}개 / {item.price}원
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => router.push(`/order/edit/${order.id}`)} color="primary" aria-label="주문 수정">수정</Button>
        <Button onClick={handleCancel} color="danger" aria-label="주문 취소">주문 취소</Button>
        <Button onClick={handleRefund} color="danger" aria-label="환불(관리자)">환불(관리자)</Button>
        <Button onClick={handleExportPdf} color="default" aria-label="PDF 내보내기">PDF 내보내기</Button>
        <Button onClick={() => router.push("/order") } color="default" aria-label="목록으로">목록</Button>
      </div>
      <div className="mt-6">
        <h3 className="font-bold mb-2" tabIndex={0} aria-label="상태 변경 이력">상태 변경 이력</h3>
        <ul className="divide-y" role="list" aria-label="상태 변경 이력 목록">
          {logs.length === 0 && <li className="py-2 text-gray-400" aria-label="이력이 없습니다.">이력이 없습니다.</li>}
          {logs.map((log: OrderStatusLog) => (
            <li key={log.id} className="py-2 text-xs" tabIndex={0} aria-label={`상태: ${log.status}, 변경일: ${log.changed_at || log.created_at}` }>
              {log.status} / {log.changed_at || log.created_at}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
