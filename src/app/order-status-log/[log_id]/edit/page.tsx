"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderStatusLog } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function OrderStatusLogEditPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params?.log_id;
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!logId) return;
    getOrderStatusLog(Number(logId)).then(res => setForm(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, [logId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // TODO: updateOrderStatusLog API 적용 필요
    setSuccess('수정되었습니다. (API 미구현)');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">주문 상태 로그 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* 필요한 입력 필드 추가 */}
        <input name="status" value={form.status || ''} placeholder="상태" onChange={handleChange} className="border p-2 w-full" />
        <Button type="submit">수정</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
