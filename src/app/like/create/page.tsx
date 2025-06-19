"use client";
import { useState } from 'react';
import { createLike } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function LikeCreatePage() {
  const [form, setForm] = useState<any>({ content_type: '', object_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await createLike(form);
      setSuccess('등록되었습니다.');
      setForm({ content_type: '', object_id: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">좋아요 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="content_type" value={form.content_type} onChange={handleChange} placeholder="Content type (정수)" className="border p-2 w-full" required />
        <input name="object_id" value={form.object_id} onChange={handleChange} placeholder="Object id (정수)" className="border p-2 w-full" required />
        <Button type="submit" disabled={loading}>{loading ? '등록 중...' : '등록'}</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
