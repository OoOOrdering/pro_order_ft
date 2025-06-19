"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Input from '@/components/Input';

export default function PresetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const presetId = params?.preset_id;
  const [preset, setPreset] = useState<any>(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!presetId) return;
    setLoading(true);
    api.get(`/preset-messages/${presetId}/`).then(res => {
      setPreset(res.data);
      setContent(res.data.content);
    }).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [presetId]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.put(`/preset-messages/${presetId}/`, { content });
      setSuccess('수정되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    try {
      await api.delete(`/preset-messages/${presetId}/`);
      alert('삭제되었습니다.');
      router.push('/preset-message');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!preset) return <div>프리셋 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">프리셋 상세/수정</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input label="내용" value={content} onChange={e => setContent(e.target.value)} required />
        <Button type="submit">수정</Button>
        <Button type="button" color="danger" onClick={handleDelete}>삭제</Button>
      </form>
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
