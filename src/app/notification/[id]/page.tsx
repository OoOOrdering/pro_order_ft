"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/axios';

export default function NotificationDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/notifications/${id}/`).then(res => setData(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">알림 상세</h2>
      <div>제목: {data.title}</div>
      <div>내용: {data.content}</div>
      <div>생성일: {data.created_at}</div>
    </div>
  );
}
