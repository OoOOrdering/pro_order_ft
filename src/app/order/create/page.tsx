"use client";
import { useState } from "react";
import { createOrder } from "@/api/swagger";
import type { OrderCreate, OrderItem } from "@/types/swagger";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

const defaultItem = { product_name: "", quantity: 1, price: "0" };

export default function OrderCreatePage() {
  const [form, setForm] = useState<OrderCreate>({
    shipping_address: "",
    shipping_phone: "",
    shipping_name: "",
    shipping_memo: "",
    items: [{ ...defaultItem }],
    payment_method: "카드",
    total_amount: "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleItemChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [e.target.name]: e.target.value };
    setForm((f) => ({ ...f, items }));
    updateTotal(items);
  };
  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, { ...defaultItem }] }));
  };
  const removeItem = (idx: number) => {
    const items = form.items.filter((_, i) => i !== idx);
    setForm((f) => ({ ...f, items }));
    updateTotal(items);
  };
  const updateTotal = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    setForm((f) => ({ ...f, total_amount: String(total) }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await createOrder(form);
      setSuccess("주문이 생성되었습니다!");
      router.push(`/order/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">주문 생성</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input name="shipping_name" value={form.shipping_name} onChange={handleChange} label="수령인" required />
        <Input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} label="연락처" required />
        <Input name="shipping_address" value={form.shipping_address} onChange={handleChange} label="배송 주소" required />
        <Input name="shipping_memo" value={form.shipping_memo} onChange={handleChange} label="배송 메모" />
        <div className="font-bold mt-4">주문 아이템</div>
        {form.items.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input name="product_name" value={item.product_name} onChange={e => handleItemChange(idx, e)} label="상품명" required />
            <Input name="quantity" type="number" value={item.quantity} onChange={e => handleItemChange(idx, e)} label="수량" min={1} required />
            <Input name="price" type="number" value={item.price} onChange={e => handleItemChange(idx, e)} label="가격" min={0} required />
            {form.items.length > 1 && <Button type="button" color="danger" onClick={() => removeItem(idx)}>삭제</Button>}
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
        <Button type="submit" color="primary">주문하기</Button>
      </form>
      {error && <ErrorMessage message={error} />}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
}
