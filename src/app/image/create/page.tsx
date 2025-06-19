"use client";
import { useRef, useState } from 'react';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function ImageCreatePage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fileInput.current?.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', fileInput.current.files[0]);
    try {
      await api.post('/images/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('업로드 성공!');
      if (fileInput.current) fileInput.current.value = '';
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">이미지 업로드</h2>
      <form onSubmit={handleUpload} className="mb-4">
        <input type="file" ref={fileInput} className="border p-2" />
        <Button type="submit" className="ml-2">업로드</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
