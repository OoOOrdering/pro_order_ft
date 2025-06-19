"use client";
import { useState } from 'react';
import { createNotification } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function NotificationCreatePage() {
  const [form, setForm] = useState<any>({ title: '', content: '', user: '', is_read: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await createNotification(form);
      setSuccess('등록되었습니다.');
      setForm({ title: '', content: '', user: '', is_read: false });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="제목" className="border p-2 w-full" required />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용" className="border p-2 w-full" required />
        <input name="user" value={form.user} onChange={handleChange} placeholder="사용자 ID" className="border p-2 w-full" required />
        <label className="flex items-center"><input type="checkbox" name="is_read" checked={form.is_read} onChange={e => setForm((f: any) => ({ ...f, is_read: e.target.checked }))} /> 읽음 여부</label>
        <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
