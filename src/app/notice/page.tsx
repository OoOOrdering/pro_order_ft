"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { getNoticeList } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Toast from "@/components/Toast";
import { useList } from "@/hooks/useList";
import { useEffect } from "react";
import * as T from "@/types/swagger";

export default function NoticePage() {
  const router = useRouter();
  const { list, loading, error } = useList<T.Notice>(
    "notice-list",
    async () => (await getNoticeList()).data ?? [],
    {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    if (error) {
      const err: any = error;
      Toast.show({
        type: "error",
        message:
          typeof err === "string"
            ? err
            : err?.message
            ? err.message
            : JSON.stringify(err),
      });
    }
  }, [error]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2
        className="text-2xl font-bold mb-4"
        tabIndex={0}
        aria-label="공지사항"
      >
        공지사항
      </h2>
      <Button
        onClick={() => router.push("/notice/create")}
        color="primary"
        aria-label="공지 등록"
      >
        공지 등록
      </Button>
      <ul
        className="divide-y mt-4"
        role="list"
        aria-label="공지사항 목록"
      >
        {list.length === 0 && (
          <li
            className="py-4 text-gray-400"
            aria-label="공지사항이 없습니다."
          >
            공지사항이 없습니다.
          </li>
        )}
        {list.map((n: T.Notice) => (
          <li
            key={n.id}
            className="py-2"
            tabIndex={0}
            aria-label={`제목: ${n.title}`}
          >
            <span
              onClick={() => router.push(`/notice/${n.id}`)}
              className="cursor-pointer text-blue-500 underline"
              aria-label={`공지 상세: ${n.title}`}
            >
              {n.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
