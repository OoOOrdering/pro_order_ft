"use client";
import { useState } from 'react';
import { createReview } from '@/api/swagger';
import Button from '@/components/Button';
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";
import type { ReviewCreateUpdate } from '@/types/swagger';

export default function ReviewCreatePage() {
  const [form, setForm] = useState<ReviewCreateUpdate>({ rating: 5, comment: '', is_public: true });
  const [commentLength, setCommentLength] = useState(0);
  const COMMENT_MAX = 200;

  const { run: createReviewAsync, loading } = useAsync(async (data: ReviewCreateUpdate) => createReview({ ...data, comment: data.comment?.trim() }), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "등록되었습니다." });
      setForm({ rating: 5, comment: '', is_public: true });
      setCommentLength(0);
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "comment") {
      setForm({ ...form, comment: value.slice(0, COMMENT_MAX) });
      setCommentLength(value.trim().length);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReviewAsync(form);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">리뷰 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} className="border p-2 w-full" required />
        <textarea name="comment" value={form.comment} onChange={handleChange} placeholder="리뷰 내용" className="border p-2 w-full" maxLength={COMMENT_MAX} />
        <div className="text-xs text-gray-500 mb-1">({commentLength}/{COMMENT_MAX}자)</div>
        <label className="flex items-center"><input type="checkbox" name="is_public" checked={form.is_public} onChange={e => setForm((f) => ({ ...f, is_public: e.target.checked }))} /> 공개 여부</label>
        <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
      </form>
    </div>
  );
}
