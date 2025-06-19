"use client";
import { getCSPostList } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import List from "@/components/List";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CSPost } from "../../types/swagger";

export default function CSPostPage() {
  const { data: list = [], isLoading: loading, error } = useQuery<CSPost[]>({
    queryKey: ["cs-posts"],
    queryFn: async () => {
      const res = await getCSPostList();
      return res.data;
    },
  });
  const router = useRouter();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">고객센터 문의</h2>
      <Button onClick={() => router.push("/cs-post/create")} color="primary">
        문의 등록
      </Button>
      <List
        items={list}
        renderItem={(post: CSPost) => (
          <span
            onClick={() => router.push(`/cs-post/${post.id}`)}
            className="cursor-pointer text-blue-500 underline"
          >
            {post.title}
          </span>
        )}
      />
    </div>
  );
}
