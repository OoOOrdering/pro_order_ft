"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWork, updateWork } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function WorkEditPage() {
  const params = useParams();
  const router = useRouter();
  const workId = params?.work_id;
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!workId) return;
    getWork(Number(workId)).then(res => setForm(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, [workId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateWork(Number(workId), form);
      setSuccess('수정되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">작업 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* 필요한 입력 필드 추가 */}
        <input name="title" value={form.title || ''} placeholder="제목" onChange={handleChange} className="border p-2 w-full" />
        <Button type="submit">수정</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
