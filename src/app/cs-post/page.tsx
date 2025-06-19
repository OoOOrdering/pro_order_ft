"use client";
import { getCSPostList } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CSPostPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getCSPostList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">고객센터 문의</h2>
      <Button onClick={() => router.push("/cs-post/create")} color="primary">
        문의 등록
      </Button>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <Loading />
      ) : (
        <ul className="divide-y mt-4">
          {list.length === 0 && (
            <li className="py-4 text-gray-400">문의가 없습니다.</li>
          )}
          {list.map((post) => (
            <li key={post.id} className="py-2">
              <span
                onClick={() => router.push(`/cs-post/${post.id}`)}
                className="cursor-pointer text-blue-500 underline"
              >
                {post.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
