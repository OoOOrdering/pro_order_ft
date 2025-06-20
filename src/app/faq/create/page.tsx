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
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

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
  const [questionLength, setQuestionLength] = useState(0);
  const [answerLength, setAnswerLength] = useState(0);
  const QUESTION_MAX = 100;
  const ANSWER_MAX = 1000;
  const router = useRouter();

  const { run: createFaqAsync, loading } = useAsync(
    async (data: { question: string; answer: string }) =>
      createFaq({ question: data.question.trim(), answer: data.answer.trim() }),
    {
      onSuccess: res => {
        Toast.show({ type: "success", message: "등록되었습니다." });
        setTimeout(() => router.push(`/faq/${res.data.id}`), 1000);
        reset();
        setQuestionLength(0);
        setAnswerLength(0);
      },
      onError: err => {
        Toast.show({ type: "error", message: err?.message || "오류 발생" });
      },
    }
  );

  const onSubmit = async (data: { question: string; answer: string }) => {
    await createFaqAsync(data);
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
          maxLength={QUESTION_MAX}
          onChange={e => {
            register("question").onChange(e);
            setQuestionLength(e.target.value.trim().length);
          }}
          helperText={`(${questionLength}/${QUESTION_MAX}자)`}
        />
        <Input
          label="답변"
          {...register("answer")}
          error={errors.answer?.message}
          required
          maxLength={ANSWER_MAX}
          onChange={e => {
            register("answer").onChange(e);
            setAnswerLength(e.target.value.trim().length);
          }}
          helperText={`(${answerLength}/${ANSWER_MAX}자)`}
        />
        <Button type="submit" disabled={isSubmitting}>
          등록
        </Button>
      </form>
      {/* <ErrorMessage message={error} /> */}
      {/* {success && <div className="text-green-500 mt-2">{success}</div>} */}
    </div>
  );
}
