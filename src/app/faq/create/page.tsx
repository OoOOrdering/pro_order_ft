"use client";
import { useState } from "react";
import { createFaq } from "@/api/swagger";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function FAQCreatePage() {
  const schema = yup.object().shape({
    question: yup.string().required("질문을 입력하세요."),
    answer: yup.string().required("답변을 입력하세요."),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { question: "", answer: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const onSubmit = async (data: { question: string; answer: string }) => {
    setError("");
    setSuccess("");
    try {
      const res = await createFaq(data);
      setSuccess("등록되었습니다.");
      setTimeout(() => router.push(`/faq/${res.data.id}`), 1000);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">FAQ 등록</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input
          label="질문"
          {...register("question")}
          error={errors.question?.message}
          required
        />
        <Input
          label="답변"
          {...register("answer")}
          error={errors.answer?.message}
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          등록
        </Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
