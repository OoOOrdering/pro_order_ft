"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReview, updateReview } from '@/api/swagger';
import Button from '@/components/Button';
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";
import type { ReviewCreateUpdate } from '@/types/swagger';

export default function ReviewEditPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params?.review_id;
  const [form, setForm] = useState<ReviewCreateUpdate>({ rating: 5, comment: '', is_public: false });
  const { run: updateReviewAsync, loading } = useAsync(async (id: number, form: ReviewCreateUpdate) => updateReview(id, form), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "수정되었습니다." });
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  useEffect(() => {
    if (!reviewId) return;
    const id = Array.isArray(reviewId) ? Number(reviewId[0]) : Number(reviewId);
    getReview(id).then(res => setForm(res.data)).catch(err => Toast.show({ type: "error", message: err.response?.data?.detail || err.message }));
  }, [reviewId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateReviewAsync(Array.isArray(reviewId) ? Number(reviewId[0]) : Number(reviewId), form);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">리뷰 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="rating" type="number" min={1} max={5} value={form.rating || 5} onChange={handleChange} className="border p-2 w-full" required />
        <textarea name="comment" value={form.comment || ''} onChange={handleChange} placeholder="리뷰 내용" className="border p-2 w-full" />
        <label className="flex items-center"><input type="checkbox" name="is_public" checked={form.is_public || false} onChange={e => setForm((f) => ({ ...f, is_public: e.target.checked }))} /> 공개 여부</label>
        <Button type="submit" disabled={loading}>{loading ? '수정 중...' : '수정'}</Button>
      </form>
      {/* <ErrorMessage message={error} /> */}
      {/* {success && <div className="text-green-500 mt-2">{success}</div>} */}
    </div>
  );
}
