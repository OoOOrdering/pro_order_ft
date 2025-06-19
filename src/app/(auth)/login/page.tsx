"use client";
import { useState } from 'react';
import { setToken } from '@/utils/token';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post<{ access: string }>('/auth/jwt/create/', {
        username,
        password,
      });
      setToken(data.access);
      router.push('/profile');
    } catch (err: any) {
      setError('로그인 실패: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">로그인 (axios)</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border p-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">로그인</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
