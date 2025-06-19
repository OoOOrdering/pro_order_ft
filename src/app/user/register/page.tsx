"use client";
import { useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/users/register/', { email, password, nickname });
      setSuccess('회원가입 성공! 인증 메일을 확인하세요.');
      setTimeout(() => router.push('/(auth)/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleRegister} className="space-y-2">
        <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 w-full" />
        <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 w-full" />
        <input type="text" placeholder="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} required className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">회원가입</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
