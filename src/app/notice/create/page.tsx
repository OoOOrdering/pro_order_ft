"use client";
import { useState } from "react";
import { createNotice } from "@/api/swagger";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useAsync } from "@/hooks/useAsync";
import * as T from "@/types/swagger";

export default function NoticeCreatePage() {
  const [form, setForm] = useState<Partial<T.NoticeCreateUpdate>>({ title: '', content: '' });
  const router = useRouter();
  const { loading, error, run } = useAsync(createNotice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await run({ title: form.title, content: form.content });
      Toast.show({ type: "success", message: "등록되었습니다." });
      setTimeout(() => router.push(`/notice/${res.data.id}`), 1000);
    } catch (err) {
      Toast.show({ type: "error", message: error || "등록에 실패했습니다." });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">공지 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input label="제목" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <Input label="내용" value={form.content ?? ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
        <Button type="submit" disabled={loading}>{loading ? "등록 중..." : "등록"}</Button>
      </form>
    </div>
  );
}
