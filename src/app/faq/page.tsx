"use client";
import { useQuery } from "@tanstack/react-query";
import { getFaqList } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";
import List from "@/components/List";
import type { FAQ } from "../../types/swagger";

export default function FAQPage() {
  const { data: list = [], isLoading: loading, error } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await getFaqList();
      return res.data;
    },
  });
  const router = useRouter();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      <Button onClick={() => router.push("/faq/create")} color="primary">FAQ 등록</Button>
      <List items={list} renderItem={(faq: FAQ) => (
        <span onClick={() => router.push(`/faq/${faq.id}`)} className="cursor-pointer text-blue-500 underline">{faq.question}</span>
      )} />
    </div>
  );
}
