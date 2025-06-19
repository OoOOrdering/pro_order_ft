"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/analytics/summary/').then(res => setSummary(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!summary) return <div>로딩 중...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">통계 요약</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}
