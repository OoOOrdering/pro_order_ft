"use client";
import { useEffect, useState } from "react";
import { getFaqList } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

export default function FAQPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getFaqList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      <Button onClick={() => router.push("/faq/create")} color="primary">FAQ 등록</Button>
      <ul className="divide-y mt-4">
        {list.length === 0 && <li className="py-4 text-gray-400">FAQ가 없습니다.</li>}
        {list.map((faq) => (
          <li key={faq.id} className="py-2">
            <span onClick={() => router.push(`/faq/${faq.id}`)} className="cursor-pointer text-blue-500 underline">{faq.question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
