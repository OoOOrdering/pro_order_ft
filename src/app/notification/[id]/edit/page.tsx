"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNotification, updateNotification } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function NotificationEditPage() {
  const params = useParams();
  const router = useRouter();
  const notificationId = params?.id;
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!notificationId) return;
    const id = Array.isArray(notificationId) ? notificationId[0] : notificationId;
    setLoading(true);
    getNotification(id).then(res => setForm(res.data)).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [notificationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateNotification(Array.isArray(notificationId) ? notificationId[0] : notificationId, form);
      setSuccess('수정되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="title" value={form.title || ''} onChange={handleChange} placeholder="제목" className="border p-2 w-full" required />
        <textarea name="content" value={form.content || ''} onChange={handleChange} placeholder="내용" className="border p-2 w-full" required />
        <input name="user" value={form.user || ''} onChange={handleChange} placeholder="사용자 ID" className="border p-2 w-full" required />
        <label className="flex items-center"><input type="checkbox" name="is_read" checked={form.is_read || false} onChange={e => setForm((f: any) => ({ ...f, is_read: e.target.checked }))} /> 읽음 여부</label>
        <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정'}</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
