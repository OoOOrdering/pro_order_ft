"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { getNotificationList, markNotificationAsRead, deleteNotification } from "@/api/swagger";
import Button from "@/components/Button";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";
import { useList } from "@/hooks/useList";
import { useAsync } from "@/hooks/useAsync";
import { useEffect } from "react";
import * as T from "@/types/swagger";

export default function NotificationPage() {
  const router = useRouter();
  const { list, loading, error, refetch } = useList<T.Notification>(
    "notification-list",
    async () => (await getNotificationList()).data ?? [],
    {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    }
  );
  const { run: markRead } = useAsync(async (id: string) => {
    await markNotificationAsRead(id);
    Toast.show({ type: "success", message: "읽음 처리되었습니다." });
    refetch();
  });
  const { run: remove } = useAsync(async (id: string) => {
    await deleteNotification(id);
    Toast.show({ type: "success", message: "삭제되었습니다." });
    refetch();
  });
  useEffect(() => { if (error) Toast.show({ type: "error", message: error.message }); }, [error]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4" tabIndex={0} aria-label="알림 목록">알림 목록</h2>
      {loading ? <Loading /> : (
        <ul className="divide-y mt-4" role="list" aria-label="알림 목록">
          {(!list || list.length === 0) && <li className="py-4 text-gray-400" aria-label="알림이 없습니다.">알림이 없습니다.</li>}
          {list?.map((n: T.Notification) => (
            <li key={n.id} className={`py-2 ${n.is_read ? '' : 'font-bold'}`} tabIndex={0} aria-label={`제목: ${n.title}, 읽음: ${n.is_read ? '예' : '아니오'}` }>
              <span onClick={() => router.push(`/notification/${n.id}`)} className="cursor-pointer" aria-label={`알림 상세: ${n.title}`}>{n.title}</span>
              <Button onClick={() => markRead(n.id)} color="default" size="sm" aria-label="읽음 처리">읽음</Button>
              <Button onClick={() => remove(n.id)} color="danger" size="sm" aria-label="알림 삭제">삭제</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
