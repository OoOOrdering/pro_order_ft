"use client";
import { useState } from 'react';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Input from '@/components/Input';

export default function ProgressCreatePage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/progresses/', { status });
      setSuccess('등록되었습니다.');
      setStatus('');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">진행상황 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input label="상태" value={status} onChange={e => setStatus(e.target.value)} required />
        <Button type="submit">등록</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
