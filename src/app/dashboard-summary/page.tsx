"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function DashboardSummaryPage() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard-summaries/').then(res => setList(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">대시보드 요약</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {list.map((summary, i) => (
          <li key={summary.id || i} className="border-b py-2">{JSON.stringify(summary)}</li>
        ))}
      </ul>
    </div>
  );
}
