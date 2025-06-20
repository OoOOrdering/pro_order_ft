"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder, updateOrder } from "@/api/swagger";
import type { Order, OrderItem } from "@/types/swagger";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

const defaultItem = { product_name: "", quantity: 1, price: "0" };

export default function OrderEditPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.order_id;
  const [form, setForm] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrder(Number(orderId))
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const { run: updateOrderAsync, loading: updating } = useAsync(async (id: number, form: Order) => updateOrder(id, form), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "주문이 수정되었습니다!" });
      setTimeout(() => router.push(`/order/${orderId}`), 1000);
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleItemChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const items = [...(form.items || [])];
    items[idx] = { ...items[idx], [e.target.name]: e.target.value };
    setForm({ ...form, items });
    updateTotal(items);
  };
  const addItem = () => {
    if (!form) return;
    setForm({ ...form, items: [...(form.items || []), { ...defaultItem }] });
  };
  const removeItem = (idx: number) => {
    if (!form) return;
    const items = (form.items || []).filter((_, i) => i !== idx);
    setForm({ ...form, items });
    updateTotal(items);
  };
  const updateTotal = (items: OrderItem[]) => {
    if (!form) return;
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    setForm({ ...form, total_amount: String(total) });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    await updateOrderAsync(Number(orderId), form);
  };

  if (updating || !form) return <Loading />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">주문 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input name="shipping_name" value={form.shipping_name} onChange={handleChange} label="수령인" required />
        <Input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} label="연락처" required />
        <Input name="shipping_address" value={form.shipping_address} onChange={handleChange} label="배송 주소" required />
        <Input name="shipping_memo" value={form.shipping_memo || ""} onChange={handleChange} label="배송 메모" />
        <div className="font-bold mt-4">주문 아이템</div>
        {form.items?.map((item, idx) => (
          <div key={item.id || idx} className="flex gap-2 mb-2">
            <Input name="product_name" value={item.product_name} onChange={e => handleItemChange(idx, e)} label="상품명" required />
            <Input name="quantity" type="number" value={item.quantity} onChange={e => handleItemChange(idx, e)} label="수량" min={1} required />
            <Input name="price" type="number" value={item.price} onChange={e => handleItemChange(idx, e)} label="가격" min={0} required />
            {form.items && form.items.length > 1 && <Button type="button" color="danger" onClick={() => removeItem(idx)}>삭제</Button>}
          </div>
        ))}
        <Button type="button" color="default" onClick={addItem}>아이템 추가</Button>
        <div className="mt-2">총 금액: <span className="font-semibold">{form.total_amount}원</span></div>
        <div className="mt-2">
          <label className="block mb-1">결제 방법</label>
          <select name="payment_method" value={form.payment_method} onChange={handleChange} className="border p-2 w-full">
            <option value="카드">카드</option>
            <option value="계좌이체">계좌이체</option>
            <option value="무통장입금">무통장입금</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <Button type="submit" color="primary">수정하기</Button>
      </form>
      {error && <ErrorMessage message={error} />}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
}
