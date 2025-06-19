"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function ProgressPage() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/progresses/').then(res => setList(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">진행상황</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {list.map((progress, i) => (
          <li key={progress.id || i} className="border-b py-2">{progress.status} ({progress.updated_at})</li>
        ))}
      </ul>
    </div>
  );
}
