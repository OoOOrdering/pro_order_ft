"use client";
import { useEffect } from 'react';
import api from '@/utils/axios';
import { useAsync } from '@/hooks/useAsync';
import Toast from '@/components/Toast';

interface UserProfile {
  email: string;
  nickname: string;
  date_joined?: string;
}

export default function ProfilePage() {
  const { result, loading, error, run } = useAsync(async () => (await api.get<UserProfile>('/users/profile/')).data);

  useEffect(() => { run(); }, []);
  useEffect(() => { if (error) Toast.show({ type: 'error', message: error }); }, [error]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return null;
  if (!result) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">내 프로필</h2>
      <div className="mb-2">이메일: {result.email}</div>
      <div className="mb-2">닉네임: {result.nickname}</div>
      {result.date_joined && <div className="mb-2">가입일: {result.date_joined}</div>}
      <a href="/user/profile/edit" className="text-blue-500 underline">프로필 수정</a>
    </div>
  );
}
