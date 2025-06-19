"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Input from '@/components/Input';

export default function CSPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.post_id;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    api.get(`/cs-posts/${postId}/`).then(res => {
      setTitle(res.data.title);
      setContent(res.data.content);
    }).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [postId]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.patch(`/cs-posts/${postId}/`, { title, content });
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
      await api.delete(`/cs-posts/${postId}/`);
      alert('삭제되었습니다.');
      router.push('/cs-post');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">문의 수정/삭제</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} required />
        <Input label="내용" value={content} onChange={e => setContent(e.target.value)} required />
        <Button type="submit">수정</Button>
        <Button type="button" color="danger" onClick={handleDelete}>삭제</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
