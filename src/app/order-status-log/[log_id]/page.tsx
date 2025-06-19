"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderStatusLog } from '@/api/swagger';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

export default function OrderStatusLogDetailPage() {
  const params = useParams();
  const logId = params?.log_id;
  const [log, setLog] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!logId) return;
    setLoading(true);
    getOrderStatusLog(Number(logId)).then(res => setLog(res.data)).catch(err => setError(err.response?.data?.detail || err.message)).finally(() => setLoading(false));
  }, [logId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!log) return <div>상태 로그 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">주문 상태 로그 상세</h2>
      <pre className="bg-gray-100 p-4 rounded mb-4">{JSON.stringify(log, null, 2)}</pre>
    </div>
  );
}
