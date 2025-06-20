"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFaq, updateFaq, deleteFaq } from "@/api/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

export default function FAQEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const { run: updateFaqAsync, loading: updating } = useAsync(
    async (id: number, question: string, answer: string) =>
      updateFaq(id, { question, answer }),
    {
      onSuccess: () => {
        Toast.show({ type: "success", message: "수정되었습니다." });
        setTimeout(() => router.push(`/faq/${id}`), 1000);
      },
      onError: (err) => {
        Toast.show({ type: "error", message: err?.message || "오류 발생" });
      },
    }
  );
  const { run: deleteFaqAsync, loading: deleting } = useAsync(
    async (id: number) => deleteFaq(id),
    {
      onSuccess: () => {
        Toast.show({ type: "success", message: "삭제되었습니다." });
        router.push("/faq");
      },
      onError: (err) => {
        Toast.show({ type: "error", message: err?.message || "오류 발생" });
      },
    }
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFaq(Number(id))
      .then((res) => {
        setQuestion(res.data.question);
        setAnswer(res.data.answer);
      })
      .catch((err) => Toast.show({ type: "error", message: err.message }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFaqAsync(Number(id), question, answer);
  };
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteFaqAsync(Number(id));
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">FAQ 수정</h2>
      <form onSubmit={handleEdit} className="space-y-2">
        <Input
          label="질문"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <Input
          label="답변"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <Button type="submit">수정</Button>
      </form>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleDelete} color="danger">
          삭제
        </Button>
        <Button onClick={() => router.push(`/faq/${id}`)} color="default">
          상세
        </Button>
      </div>
      {/* <ErrorMessage message={error} /> */}
      {/* {success && <div className="text-green-600 mt-2">{success}</div>} */}
    </div>
  );
}
