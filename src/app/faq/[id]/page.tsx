"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFaq, deleteFaq } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

export default function FAQDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFaq(Number(id))
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const { run: deleteFaqAsync, loading: deleting } = useAsync(async (id: number) => deleteFaq(id), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "삭제되었습니다." });
      setTimeout(() => router.push("/faq"), 1000);
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteFaqAsync(Number(id));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">FAQ 상세</h2>
      <div className="mb-2 font-bold">{data.question}</div>
      <div className="mb-2">{data.answer}</div>
      <div className="mb-2 text-xs text-gray-400">작성일: {data.created_at?.slice(0, 10)}</div>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => router.push(`/faq/${id}/edit`)} color="primary">수정</Button>
        <Button onClick={handleDelete} color="danger" loading={deleting}>삭제</Button>
        <Button onClick={() => router.push("/faq")} color="default">목록</Button>
      </div>
    </div>
  );
}
