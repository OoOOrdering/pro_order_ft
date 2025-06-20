"use client";
import { useState } from 'react';
import { createNotification } from '@/api/swagger';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { useAsync } from '@/hooks/useAsync';
import * as T from "@/types/swagger";

export default function NotificationCreatePage() {
  const [form, setForm] = useState<Partial<T.Notification>>({ title: '', content: '', user: 0, is_read: false });
  const { loading, error, run } = useAsync(createNotification);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await run(form);
      Toast.show({ type: 'success', message: '등록되었습니다.' });
      setForm({ title: '', content: '', user: 0, is_read: false });
    } catch (err) {
      Toast.show({ type: 'error', message: error || '등록에 실패했습니다.' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="제목" className="border p-2 w-full" required />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용" className="border p-2 w-full" required />
        <input name="user" value={form.user ?? ''} onChange={handleChange} placeholder="사용자 ID" className="border p-2 w-full" required />
        <label className="flex items-center"><input type="checkbox" name="is_read" checked={form.is_read ?? false} onChange={e => setForm((f) => ({ ...f, is_read: e.target.checked }))} /> 읽음 여부</label>
        <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
      </form>
    </div>
  );
}
