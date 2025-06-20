"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNotification, updateNotification } from '@/api/swagger';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { useAsync } from '@/hooks/useAsync';
import * as T from "@/types/swagger";

export default function NotificationEditPage() {
  const params = useParams();
  const router = useRouter();
  const notificationId = params?.id;
  const [form, setForm] = useState<Partial<T.Notification>>({});
  const { loading, error, run: fetch } = useAsync(getNotification);
  const { loading: updateLoading, run: update } = useAsync(updateNotification);

  useEffect(() => {
    if (!notificationId) return;
    const id = Array.isArray(notificationId) ? notificationId[0] : notificationId;
    fetch(id).then((res) => setForm(res.data)).catch((err) => Toast.show({ type: 'error', message: error || '불러오기 실패' }));
  }, [notificationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await update(Array.isArray(notificationId) ? notificationId[0] : notificationId as string, form);
      Toast.show({ type: 'success', message: '수정되었습니다.' });
    } catch (err) {
      Toast.show({ type: 'error', message: error || '수정에 실패했습니다.' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="title" value={form.title || ''} onChange={handleChange} placeholder="제목" className="border p-2 w-full" required />
        <textarea name="content" value={form.content || ''} onChange={handleChange} placeholder="내용" className="border p-2 w-full" required />
        <input name="user" value={form.user ?? ''} onChange={handleChange} placeholder="사용자 ID" className="border p-2 w-full" required />
        <label className="flex items-center"><input type="checkbox" name="is_read" checked={form.is_read ?? false} onChange={e => setForm((f) => ({ ...f, is_read: e.target.checked }))} /> 읽음 여부</label>
        <Button type="submit" disabled={updateLoading}>{updateLoading ? '수정 중...' : '수정'}</Button>
      </form>
    </div>
  );
}
