"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

export default function LikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const likeId = params?.like_id;
  const [like, setLike] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!likeId) return;
    setLoading(true);
    api.get(`/likes/${likeId}/`).then(res => setLike(res.data)).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [likeId]);

  const handleDelete = async () => {
    if (!confirm('정말 좋아요를 취소하시겠습니까?')) return;
    setLoading(true);
    try {
      await api.delete(`/likes/${likeId}/`);
      alert('좋아요가 취소되었습니다.');
      router.push('/like');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!like) return <div>좋아요 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">좋아요 상세</h2>
      <div>대상: {like.target}</div>
      <Button color="danger" onClick={handleDelete}>좋아요 취소</Button>
    </div>
  );
}
