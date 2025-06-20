"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/axios';
import { useAsync } from '@/hooks/useAsync';
import Toast from '@/components/Toast';
import * as T from "@/types/swagger";

export default function NotificationDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { result, loading, error, run } = useAsync(async (id: string) => (await api.get<T.Notification>(`/notifications/${id}/`)).data);

  useEffect(() => {
    if (!id) return;
    run(id).catch((err) => Toast.show({ type: 'error', message: error || '불러오기 실패' }));
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!result) return null;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 상세</h2>
      <div>제목: {result.title}</div>
      <div>내용: {result.content}</div>
      <div>생성일: {result.created_at}</div>
    </div>
  );
}
