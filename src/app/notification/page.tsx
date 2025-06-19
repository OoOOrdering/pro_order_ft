"use client";
import { useEffect, useState } from "react";
import { getNotificationList, markNotificationAsRead, deleteNotification } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function NotificationPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchList = () => {
    setLoading(true);
    getNotificationList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(fetchList, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    fetchList();
  };
  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    fetchList();
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">알림 목록</h2>
      {error && <ErrorMessage message={error} />}
      {loading ? <Loading /> : (
        <ul className="divide-y mt-4">
          {list.length === 0 && <li className="py-4 text-gray-400">알림이 없습니다.</li>}
          {list.map((n) => (
            <li key={n.id} className={`py-2 ${n.is_read ? '' : 'font-bold'}`}>
              <span onClick={() => router.push(`/notification/${n.id}`)} className="cursor-pointer">{n.title}</span>
              <Button onClick={() => handleMarkAsRead(n.id)} color="default" size="sm">읽음</Button>
              <Button onClick={() => handleDelete(n.id)} color="danger" size="sm">삭제</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
