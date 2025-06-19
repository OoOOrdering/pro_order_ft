"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/axios';

export default function CSPostDetailPage() {
  const params = useParams();
  const postId = params?.post_id;
  const [data, setData] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    api.get(`/cs-posts/${postId}/`).then(res => setData(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
    api.get(`/cs-posts/${postId}/replies/`).then(res => setReplies(res.data)).catch(() => {});
  }, [postId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">문의 상세</h2>
      <div>제목: {data.title}</div>
      <div>내용: {data.content}</div>
      <div>작성일: {data.created_at}</div>
      <h3 className="mt-4 font-bold">답변</h3>
      <ul>
        {replies.map((reply, i) => (
          <li key={reply.id || i} className="border-b py-2">{reply.content}</li>
        ))}
      </ul>
    </div>
  );
}
