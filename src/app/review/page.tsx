"use client";
import React from 'react';
import { getReviewList } from "@/api/swagger";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { useList } from "@/hooks/useList";
import type { Review } from "@/types/swagger";

export default function ReviewPage() {
  const { list, loading, error } = useList<Review>(
    "review-list",
    async () => {
      const res = await getReviewList();
      return res.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4" tabIndex={0} aria-label="내 리뷰 목록">내 리뷰 목록</h2>
      {error && <ErrorMessage message={error.message} />}
      {loading ? <Loading /> : (
        <ul className="divide-y mt-4" role="list" aria-label="리뷰 목록">
          {list.length === 0 && <li className="py-4 text-gray-400" aria-label="리뷰가 없습니다.">리뷰가 없습니다.</li>}
          {list.map((review) => (
            <li key={review.id} className="py-2" tabIndex={0} aria-label={`주문: ${review.order}, 평점: ${review.rating}`}>
              <div aria-label={`주문: ${review.order}`}>주문: {review.order}</div>
              <div aria-label={`내용: ${review.comment}`}>내용: {review.comment}</div>
              <div aria-label={`평점: ${review.rating}`}>평점: {review.rating}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
