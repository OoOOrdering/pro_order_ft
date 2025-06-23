"use client";
export default function Error({ error }: { error: Error }) {
  return <div className="text-center text-red-500 py-20">서버 오류가 발생했습니다: {error.message}</div>;
}
