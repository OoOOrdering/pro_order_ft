"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Input from '@/components/Input';
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

const schema = yup.object().shape({
  title: yup.string().required("제목을 입력하세요."),
  content: yup.string().required("내용을 입력하세요."),
});

export default function CSPostCreatePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "" },
  });
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);
  const TITLE_MAX = 100;
  const CONTENT_MAX = 1000;

  const { run: createCSPostAsync, loading } = useAsync(async (data: { title: string; content: string }) => api.post('/cs-posts/', { title: data.title.trim(), content: data.content.trim() }), {
    onSuccess: () => {
      Toast.show({ type: "success", message: "등록되었습니다." });
      reset();
      setTitleLength(0);
      setContentLength(0);
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const onSubmit = async (data: { title: string; content: string }) => {
    await createCSPostAsync(data);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">문의 등록</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input label="제목" {...register("title")}
          error={errors.title?.message}
          required
          maxLength={TITLE_MAX}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            register("title").onChange(e);
            setTitleLength(e.target.value.trim().length);
          }}
          helperText={`(${titleLength}/${TITLE_MAX}자)`}

        />
        <Input label="내용" {...register("content")}
          error={errors.content?.message}
          required
          maxLength={CONTENT_MAX}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            register("content").onChange(e);
            setContentLength(e.target.value.trim().length);
          }}
          helperText={`(${contentLength}/${CONTENT_MAX}자)`}

        />
        <Button type="submit" disabled={isSubmitting}>등록</Button>
      </form>
      {/* <ErrorMessage message={error} /> */}
      {/* {success && <div className="text-green-500 mt-2">{success}</div>} */}
    </div>
  );
}
