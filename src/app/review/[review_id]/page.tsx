"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Input from '@/components/Input';
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";
import type { Review } from '@/types/swagger';

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params?.review_id;
  const [review, setReview] = useState<Review | null>(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { run: updateReviewAsync, loading: updating } = useAsync(async (id: string | string[], content: string, rating: number) => api.patch(`/reviews/${id}/`, { content, rating }), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "리뷰가 수정되었습니다." });
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });
  const { run: deleteReviewAsync, loading: deleting } = useAsync(async (id: string | string[]) => api.delete(`/reviews/${id}/`), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "삭제되었습니다." });
      router.push('/review');
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  useEffect(() => {
    if (!reviewId) return;
    setLoading(true);
    api.get(`/reviews/${reviewId}/`).then(res => {
      setReview(res.data);
      setContent(res.data.content);
      setRating(res.data.rating);
    }).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [reviewId]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateReviewAsync(reviewId, content, rating);
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteReviewAsync(reviewId);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!review) return <div>리뷰 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">리뷰 상세/수정</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input label="내용" value={content} onChange={e => setContent(e.target.value)} required />
        <Input label="평점" type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} required />
        <Button type="submit">수정</Button>
        <Button type="button" color="danger" onClick={handleDelete}>삭제</Button>
      </form>
      {/* {success && <div className="text-green-500 mt-2">{success}</div>} */}
    </div>
  );
}
