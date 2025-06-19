"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

interface UserProfile {
  email: string;
  nickname: string;
  date_joined?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<UserProfile>('/users/profile/')
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>로딩 중...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">내 프로필</h2>
      <div className="mb-2">이메일: {profile.email}</div>
      <div className="mb-2">닉네임: {profile.nickname}</div>
      {profile.date_joined && <div className="mb-2">가입일: {profile.date_joined}</div>}
      <a href="/user/profile/edit" className="text-blue-500 underline">프로필 수정</a>
    </div>
  );
}
