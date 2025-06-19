"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [nicknameMsg, setNicknameMsg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.get('/users/profile/').then(res => setNickname(res.data.nickname));
  }, []);

  const checkNickname = async () => {
    if (!nickname) return;
    try {
      await api.post('/users/check-nickname/', { nickname });
      setNicknameMsg('사용 가능한 닉네임입니다.');
    } catch (err: any) {
      setNicknameMsg('이미 사용 중인 닉네임입니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.patch('/users/profile/', { nickname, password: password || undefined });
      setSuccess('프로필이 수정되었습니다.');
      setTimeout(() => router.push('/user/profile'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    try {
      await api.delete('/users/profile/');
      alert('탈퇴 처리되었습니다.');
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} onBlur={checkNickname} placeholder="닉네임" className="border p-2 w-full" />
        {nicknameMsg && <div className="text-sm mb-2">{nicknameMsg}</div>}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="새 비밀번호(선택)" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">수정</button>
      </form>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 w-full rounded mt-4">탈퇴(비활성화)</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
