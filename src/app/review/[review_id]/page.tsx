"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Input from '@/components/Input';

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params?.review_id;
  const [review, setReview] = useState<any>(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.patch(`/reviews/${reviewId}/`, { content, rating });
      setSuccess('리뷰가 수정되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    try {
      await api.delete(`/reviews/${reviewId}/`);
      alert('삭제되었습니다.');
      router.push('/review');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
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
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
