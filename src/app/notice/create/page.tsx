"use client";
import { useState } from "react";
import { createNotice } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function NoticeCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await createNotice({ title, content });
      setSuccess("등록되었습니다.");
      setTimeout(() => router.push(`/notice/${res.data.id}`), 1000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">공지 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} required />
        <Input label="내용" value={content} onChange={e => setContent(e.target.value)} required />
        <Button type="submit">등록</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
