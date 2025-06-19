"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from '@/utils/axios';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import Input from '@/components/Input';

const schema = yup.object().shape({
  title: yup.string().required("제목을 입력하세요."),
  content: yup.string().required("내용을 입력하세요."),
});

export default function CSPostCreatePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: { title: string; content: string }) => {
    setError("");
    setSuccess("");
    try {
      await api.post('/cs-posts/', data);
      setSuccess('등록되었습니다.');
      reset();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">문의 등록</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input label="제목" {...register("title")}
          error={errors.title?.message}
          required
        />
        <Input label="내용" {...register("content")}
          error={errors.content?.message}
          required
        />
        <Button type="submit" disabled={isSubmitting}>등록</Button>
      </form>
      <ErrorMessage message={error} />
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
