"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNotice, updateNotice, deleteNotice } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import Input from "@/components/Input";

export default function NoticeEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNotice(Number(id))
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await updateNotice(Number(id), { title, content });
      setSuccess("수정되었습니다.");
      setTimeout(() => router.push(`/notice/${id}`), 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await deleteNotice(Number(id));
      router.push("/notice");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">공지 수정</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit">수정</Button>
      </form>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleDelete} color="danger">
          삭제
        </Button>
        <Button onClick={() => router.push(`/notice/${id}`)} color="default">
          상세
        </Button>
      </div>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
