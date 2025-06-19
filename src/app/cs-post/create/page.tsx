"use client";
import { useState } from 'react';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Input from '@/components/Input';

export default function CSPostCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/cs-posts/', { title, content });
      setSuccess('등록되었습니다.');
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">문의 등록</h2>
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
