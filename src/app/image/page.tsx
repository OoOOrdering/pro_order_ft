"use client";
import { useRef, useState } from 'react';
import api from '@/utils/axios';

export default function ImagePage() {
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      // 예시: 전체 이미지 목록이 필요하다면 /images/ 엔드포인트 필요
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fileInput.current?.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', fileInput.current.files[0]);
    try {
      await api.post('/images/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('업로드 성공!');
      if (fileInput.current) fileInput.current.value = '';
      fetchImages();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">이미지 업로드</h2>
      <form onSubmit={handleUpload} className="mb-4">
        <input type="file" ref={fileInput} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ml-2">업로드</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {images.map((img, i) => (
          <li key={img.id || i}><img src={img.url} alt="업로드 이미지" className="max-w-xs" /></li>
        ))}
      </ul>
    </div>
  );
}
