"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const imageId = params?.image_id;
  const [image, setImage] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageId) return;
    setLoading(true);
    api.get(`/images/${imageId}/`).then(res => setImage(res.data)).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [imageId]);

  const handleDelete = async () => {
    if (!confirm('정말 이미지를 삭제하시겠습니까?')) return;
    setLoading(true);
    try {
      await api.delete(`/images/${imageId}/`);
      alert('이미지가 삭제되었습니다.');
      router.push('/image');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!image) return <div>이미지 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">이미지 상세</h2>
      <img src={image.url} alt="업로드 이미지" className="max-w-xs mb-4" />
      <Button color="danger" onClick={handleDelete}>삭제</Button>
    </div>
  );
}
