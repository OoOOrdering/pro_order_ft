"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWork, deleteWork } from '@/api/swagger';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workId = params?.work_id;
  const [work, setWork] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workId) return;
    setLoading(true);
    getWork(Number(workId)).then(res => setWork(res.data)).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [workId]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    try {
      await deleteWork(Number(workId));
      alert('삭제되었습니다.');
      router.push('/work');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!work) return <div>작업 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">작업 상세</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">{JSON.stringify(work, null, 2)}</pre>
      <Button color="danger" onClick={handleDelete}>삭제</Button>
    </div>
  );
}
