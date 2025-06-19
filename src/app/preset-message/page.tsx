"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function PresetMessagePage() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/preset-messages/').then(res => setList(res.data)).catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">프리셋 메시지</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {list.map((msg, i) => (
          <li key={msg.id || i} className="border-b py-2">{msg.content}</li>
        ))}
      </ul>
    </div>
  );
}
