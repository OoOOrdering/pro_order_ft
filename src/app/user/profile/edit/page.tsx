"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useAsync } from '@/hooks/useAsync';
import Toast from '@/components/Toast';

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [nicknameMsg, setNicknameMsg] = useState('');
  const [nicknameLength, setNicknameLength] = useState(0);
  const router = useRouter();
  const { run: fetch, error: fetchError } = useAsync(async () => (await api.get('/users/profile/')).data);
  const { loading: updateLoading, run: update } = useAsync(async (data: { nickname: string; password?: string }) => api.patch('/users/profile/', data));
  const { loading: deleteLoading, run: remove } = useAsync(async () => api.delete('/users/profile/'));

  useEffect(() => {
    fetch().then((data) => setNickname(data.nickname));
  }, [fetch]);
  useEffect(() => { if (fetchError) Toast.show({ type: 'error', message: fetchError }); }, [fetchError]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 10);
    setNickname(value);
    setNicknameLength(value.trim().length);
    setNicknameMsg("");
  };

  const checkNickname = async () => {
    if (!nickname.trim()) return;
    try {
      await api.post('/users/check-nickname/', { nickname: nickname.trim() });
      setNicknameMsg('사용 가능한 닉네임입니다.');
    } catch (err: any) {
      setNicknameMsg(err.response?.data?.detail || '이미 사용 중인 닉네임입니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length > 10) {
      Toast.show({ type: 'error', message: '닉네임은 10자 이내로 입력해주세요.' });
      return;
    }
    try {
      await update({ nickname: nickname.trim(), password: password || undefined });
      Toast.show({ type: 'success', message: '프로필이 수정되었습니다.' });
      setTimeout(() => router.push('/user/profile'), 1500);
    } catch (err: any) {
      Toast.show({ type: 'error', message: err?.response?.data?.detail || err?.message || '수정 실패' });
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    try {
      await remove();
      Toast.show({ type: 'success', message: '탈퇴 처리되었습니다.' });
      router.push('/');
    } catch (err: any) {
      Toast.show({ type: 'error', message: err?.response?.data?.detail || err?.message || '탈퇴 실패' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" value={nickname} onChange={handleNicknameChange} onBlur={checkNickname} placeholder="닉네임" className="border p-2 w-full" maxLength={10} />
        <div className="text-xs text-gray-500 mb-1">({nicknameLength}/10자)</div>
        {nicknameMsg && <div className="text-sm mb-2">{nicknameMsg}</div>}
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="새 비밀번호(선택)" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded" disabled={updateLoading}>{updateLoading ? '수정 중...' : '수정'}</button>
      </form>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 w-full rounded mt-4" disabled={deleteLoading}>탈퇴(비활성화)</button>
    </div>
  );
}
