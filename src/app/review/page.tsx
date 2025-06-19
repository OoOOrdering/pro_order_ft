"use client";
import { useEffect, useState } from "react";
import { getReviewList } from "@/api/swagger";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";

export default function ReviewPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getReviewList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">내 리뷰 목록</h2>
      {error && <ErrorMessage message={error} />}
      {loading ? <Loading /> : (
        <ul className="divide-y mt-4">
          {list.length === 0 && <li className="py-4 text-gray-400">리뷰가 없습니다.</li>}
          {list.map((review) => (
            <li key={review.id} className="py-2">
              <div>주문: {review.order}</div>
              <div>내용: {review.comment}</div>
              <div>평점: {review.rating}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
