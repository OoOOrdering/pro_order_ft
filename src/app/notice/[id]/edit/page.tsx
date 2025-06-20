"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNotice, updateNotice, deleteNotice } from "@/api/swagger";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { useAsync } from "@/hooks/useAsync";
import * as T from "@/types/swagger";

export default function NoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [form, setForm] = useState<Partial<T.NoticeCreateUpdate>>({});
  const { loading, error, run: fetch } = useAsync(getNotice);
  const { loading: updateLoading, run: update } = useAsync(updateNotice);
  const { loading: deleteLoading, run: remove } = useAsync(deleteNotice);

  useEffect(() => {
    if (!id) return;
    fetch(Number(id))
      .then((res) => {
        setForm(res.data);
      })
      .catch(() =>
        Toast.show({ type: "error", message: error || "불러오기 실패" })
      );
  }, [id, error, fetch]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await update(Number(id), { title: form.title, content: form.content });
      Toast.show({ type: "success", message: "수정되었습니다." });
      setTimeout(() => router.push(`/notice/${id}`), 1000);
    } catch {
      Toast.show({ type: "error", message: error || "수정에 실패했습니다." });
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await remove(Number(id));
      Toast.show({ type: "success", message: "삭제되었습니다." });
      router.push("/notice");
    } catch {
      Toast.show({ type: "error", message: error || "삭제에 실패했습니다." });
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">공지 수정</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input
          label="제목"
          value={form.title ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, title: e.target.value }))
          }
          required
        />
        <Input
          label="내용"
          value={form.content ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, content: e.target.value }))
          }
          required
        />
        <Button type="submit" disabled={updateLoading}>
          {updateLoading ? "수정 중..." : "수정"}
        </Button>
      </form>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleDelete} color="danger" disabled={deleteLoading}>
          삭제
        </Button>
        <Button onClick={() => router.push(`/notice/${id}`)} color="default">
          상세
        </Button>
      </div>
    </div>
  );
}
