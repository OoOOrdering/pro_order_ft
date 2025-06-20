"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNotice, deleteNotice } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Toast from "@/components/Toast";
import { useAsync } from "@/hooks/useAsync";
import * as T from "@/types/swagger";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { result, loading, error, run: fetch } = useAsync(async (id: number) => (await getNotice(id)).data as T.Notice);
  const { loading: deleteLoading, run: remove } = useAsync(deleteNotice);

  useEffect(() => {
    if (!id) return;
    fetch(Number(id)).catch(() => Toast.show({ type: "error", message: error || "불러오기 실패" }));
  }, [id, error, fetch]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await remove(Number(id));
      Toast.show({ type: "success", message: "삭제되었습니다." });
      setTimeout(() => router.push("/notice"), 1000);
    } catch {
      Toast.show({ type: "error", message: error || "삭제에 실패했습니다." });
    }
  };

  if (loading) return <Loading />;
  if (error) return null;
  if (!result) return null;
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">공지 상세</h2>
      <div className="mb-2 font-bold">{result.title}</div>
      <div className="mb-2">{result.content}</div>
      <div className="mb-2 text-xs text-gray-400">작성일: {result.created_at?.slice(0, 10)}</div>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => router.push(`/notice/${id}/edit`)} color="primary">수정</Button>
        <Button onClick={handleDelete} color="danger" disabled={deleteLoading}>삭제</Button>
        <Button onClick={() => router.push("/notice")} color="default">목록</Button>
      </div>
    </div>
  );
}
