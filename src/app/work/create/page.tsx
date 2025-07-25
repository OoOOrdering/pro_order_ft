"use client";
import { useState } from 'react';
import { createWork } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function WorkCreatePage() {
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createWork(form);
      setSuccess('등록되었습니다.');
      setForm({});
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">작업 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* 필요한 입력 필드 추가 */}
        <input name="title" placeholder="제목" onChange={handleChange} className="border p-2 w-full" />
        <Button type="submit">등록</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
