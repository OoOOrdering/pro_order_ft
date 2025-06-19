"use client";
import { useEffect, useState } from "react";
import { getLikeList, deleteLike } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";

export default function LikePage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getLikeList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    await deleteLike(id);
    setList(list.filter((like) => like.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">내가 누른 좋아요</h2>
      {error && <ErrorMessage message={error} />}
      {loading ? <Loading /> : (
        <ul className="divide-y mt-4">
          {list.length === 0 && <li className="py-4 text-gray-400">좋아요가 없습니다.</li>}
          {list.map((like) => (
            <li key={like.id} className="py-2 flex justify-between items-center">
              <div>대상: {like.content_type_name} #{like.object_id}</div>
              <Button onClick={() => handleDelete(like.id)} color="danger" size="sm">좋아요 취소</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
